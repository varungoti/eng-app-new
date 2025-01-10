// "use client"

// import { cn } from "@/lib/utils"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { useRef } from "react"

// interface StackingCardsProps {
//   items: {
//     title: string
//     description: string
//     icon: React.ReactNode
//   }[]
// }

// export function StackingCards({ items }: StackingCardsProps) {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   })

//   return (
//     <div ref={containerRef} className="relative h-[200vh]">
//       <div className="sticky top-[15vh]">
//         <div className="mx-auto max-w-5xl">
//           {items.map((item, index) => {
//             const translateY = useTransform(
//               scrollYProgress,
//               [0, 1],
//               [index * 100, 0]
//             )
//             const opacity = useTransform(
//               scrollYProgress,
//               [0.1, 0.3 + index * 0.1],
//               [0, 1]
//             )

//             return (
//               <motion.div
//                 key={item.title}
//                 style={{ translateY, opacity }}
//                 className={cn(
//                   "absolute left-0 right-0 rounded-xl border bg-background p-6",
//                   index === 0 && "relative"
//                 )}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="rounded-lg bg-muted p-4">{item.icon}</div>
//                   <div>
//                     <h3 className="text-xl font-bold">{item.title}</h3>
//                     <p className="text-muted-foreground">{item.description}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

