create or replace function save_lesson_complete(
  p_lesson_id uuid,
  p_title text default null,
  p_content text default null,
  p_content_heading text default null,
  p_questions jsonb default null,
  p_activities jsonb default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_result jsonb;
  v_content_id uuid;
begin
  -- Update lesson
  update lessons 
  set 
    title = coalesce(p_title, title),
    updated_at = now()
  where id = p_lesson_id;

  -- Handle lesson content
  if p_content is not null or p_content_heading is not null then
    -- Get existing content ID or generate new one
    select id into v_content_id 
    from lesson_content 
    where lesson_id = p_lesson_id 
    order by created_at desc 
    limit 1;

    if v_content_id is null then
      v_content_id := gen_random_uuid();
    end if;

    -- Upsert lesson content
    insert into lesson_content (
      id,
      lesson_id,
      content,
      content_heading,
      updated_at
    ) values (
      v_content_id,
      p_lesson_id,
      p_content,
      p_content_heading,
      now()
    )
    on conflict (id) do update set
      content = excluded.content,
      content_heading = excluded.content_heading,
      updated_at = now();
  end if;

  -- Handle questions if provided
  if p_questions is not null then
    -- Delete questions not in the new set
    delete from questions 
    where lesson_id = p_lesson_id 
    and id not in (
      select value->>'id' 
      from jsonb_array_elements(p_questions)
    );

    -- Upsert questions
    with questions_upsert as (
      select *
      from jsonb_to_recordset(p_questions) as x(
        id uuid,
        title text,
        content text,
        type text,
        points int,
        data jsonb,
        metadata jsonb,
        order_index int,
        status text,
        exercise_prompts jsonb
      )
    )
    insert into questions (
      id, lesson_id, title, content, type, points, 
      data, metadata, order_index, status
    )
    select 
      id, p_lesson_id, title, content, type, points,
      data, metadata, order_index, status
    from questions_upsert
    on conflict (id) do update set
      title = excluded.title,
      content = excluded.content,
      type = excluded.type,
      points = excluded.points,
      data = excluded.data,
      metadata = excluded.metadata,
      order_index = excluded.order_index,
      status = excluded.status,
      updated_at = now();

    -- Handle exercise prompts
    with exercise_prompts_data as (
      select 
        q.id as question_id,
        jsonb_array_elements(q.exercise_prompts) as prompt
      from jsonb_to_recordset(p_questions) as q(id uuid, exercise_prompts jsonb)
      where exercise_prompts is not null
    )
    insert into exercise_prompts (
      id,
      question_id,
      text,
      media,
      type,
      narration,
      saytext,
      user_id,
      updated_at
    )
    select
      (prompt->>'id')::uuid,
      question_id,
      prompt->>'text',
      prompt->>'media',
      prompt->>'type',
      prompt->>'narration',
      prompt->>'saytext',
      (prompt->>'user_id')::uuid,
      now()
    from exercise_prompts_data
    on conflict (id) do update set
      text = excluded.text,
      media = excluded.media,
      type = excluded.type,
      narration = excluded.narration,
      saytext = excluded.saytext,
      user_id = excluded.user_id,
      updated_at = now();
  end if;

  -- Handle activities if provided
  if p_activities is not null then
    -- Delete activities not in the new set
    delete from activities 
    where lesson_id = p_lesson_id 
    and id not in (
      select value->>'id' 
      from jsonb_array_elements(p_activities)
    );

    -- Upsert activities
    insert into activities (
      id,
      lesson_id,
      title,
      description,
      type,
      content,
      updated_at
    )
    select 
      (value->>'id')::uuid,
      p_lesson_id,
      value->>'title',
      value->>'description',
      value->>'type',
      (value->>'content')::jsonb,
      now()
    from jsonb_array_elements(p_activities)
    on conflict (id) do update set
      title = excluded.title,
      description = excluded.description,
      type = excluded.type,
      content = excluded.content,
      updated_at = now();
  end if;

  -- Return updated lesson data
  select jsonb_build_object(
    'lesson', row_to_json(l),
    'content', row_to_json(lc),
    'questions', coalesce(
      (select jsonb_agg(row_to_json(q))
       from questions q
       where q.lesson_id = p_lesson_id),
      '[]'::jsonb
    ),
    'exercise_prompts', coalesce(
      (select jsonb_agg(row_to_json(ep))
       from exercise_prompts ep
       join questions q on q.id = ep.question_id
       where q.lesson_id = p_lesson_id),
      '[]'::jsonb
    ),
    'activities', coalesce(
      (select jsonb_agg(row_to_json(a))
       from activities a
       where a.lesson_id = p_lesson_id),
      '[]'::jsonb
    )
  )
  into v_result
  from lessons l
  left join lateral (
    select * from lesson_content 
    where lesson_id = l.id 
    order by created_at desc 
    limit 1
  ) lc on true
  where l.id = p_lesson_id;

  return v_result;
end;
$$; 