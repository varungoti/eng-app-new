import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    const contentType = file.type

    const { data, error } = await supabase
      .storage
      .from('lesson-content')
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase
      .storage
      .from('lesson-content')
      .getPublicUrl(data.path)

    return NextResponse.json({
      location: publicUrl // TinyMCE expects the image URL in the "location" field
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
} 