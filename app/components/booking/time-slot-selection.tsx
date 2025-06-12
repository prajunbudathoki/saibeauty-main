// import { useBooking } from "./booking-provider";
// import { useEffect, useState } from "react";
// import { getAvailableTimeSlots } from "@/actions/booking-actions";
// import type { TimeSlot } from "@/lib/type";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";
// import { format, parseISO } from "date-fns";
// import { Clock } from "lucide-react";
// // Let's enhance the time slot selection component with better styling and animations
// // First, add the motion import at the top
// import { motion } from "motion/react";

// export function TimeSlotSelection() {
//   const { state, setTimeSlot, nextStep, prevStep } = useBooking();
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadTimeSlots() {
//       if (!state.location || !state.date) return;

//       try {
//         const data = await getAvailableTimeSlots(
//           state.location.id,
//           state.staff?.id || null,
//           state.date,
//           state.totalDuration
//         );
//         setTimeSlots(data);
//       } catch (error) {
//         console.error("Error loading time slots:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadTimeSlots();
//   }, [state.location, state.date, state.staff, state.totalDuration]);

//   const handleTimeSlotSelect = (slot: TimeSlot) => {
//     setTimeSlot(slot);
//   };

//   const handleNext = () => {
//     if (state.timeSlot) {
//       nextStep();
//     }
//   };

//   const formatTime = (isoString: string) => {
//     return format(parseISO(isoString), "h:mm a");
//   };

//   // Now update the component with better styling and animations
//   // Find the return statement and replace it with this improved version:

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-[400px]">
//         <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
//         <p className="text-muted-foreground">Loading available time slots...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold mb-6">Select a Time Slot</h2>

//         {timeSlots.length > 0 ? (
//           <motion.div
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: { opacity: 0 },
//               visible: {
//                 opacity: 1,
//                 transition: {
//                   staggerChildren: 0.03,
//                 },
//               },
//             }}
//           >
//             {timeSlots.map((slot, index) => (
//               <motion.div
//                 // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
//                 key={index}
//                 variants={{
//                   hidden: { opacity: 0, scale: 0.9, y: 10 },
//                   visible: { opacity: 1, scale: 1, y: 0 },
//                 }}
//               >
//                 <Card
//                   className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
//                     state.timeSlot?.startTime === slot.startTime
//                       ? "border-primary ring-2 ring-primary ring-opacity-30 shadow-md"
//                       : "hover:border-gray-300"
//                   }`}
//                   onClick={() => handleTimeSlotSelect(slot)}
//                 >
//                   <CardContent className="p-3 text-center">
//                     <div className="flex items-center justify-center mb-1">
//                       <Clock
//                         className={`h-4 w-4 mr-1 ${
//                           state.timeSlot?.startTime === slot.startTime
//                             ? "text-primary"
//                             : "text-muted-foreground"
//                         }`}
//                       />
//                       <p className="font-medium">
//                         {formatTime(slot.startTime)}
//                       </p>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       to {formatTime(slot.endTime)}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12 bg-muted/30 rounded-lg border border-muted"
//           >
//             <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Clock className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-xl font-medium mb-2">
//               No available time slots
//             </h3>
//             <p className="text-muted-foreground mb-2">
//               No available time slots for the selected date and staff.
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Please try selecting a different date or staff member.
//             </p>
//           </motion.div>
//         )}
//       </div>

//       <div className="flex justify-between pt-4">
//         <Button variant="outline" onClick={prevStep}>
//           Back
//         </Button>
//         <Button
//           onClick={handleNext}
//           disabled={!state.timeSlot}
//           className="px-8 bg-primary hover:bg-primary/90"
//           size="lg"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
