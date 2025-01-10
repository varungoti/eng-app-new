"use client"

type Props = {
 id: number;
 index: number;
 totalCount: number;
 locked?:boolean;
 current:boolean;
 percentage:number;
}
export const LessonButton = ({}) => {
    return (
        <button className="text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700">
            Schedule Lesson
        </button>
    );
}