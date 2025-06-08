-- CreateTable
CREATE TABLE "StaffSpecialAvailability" (
    "id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "is_available" BOOLEAN NOT NULL,
    "note" TEXT,

    CONSTRAINT "StaffSpecialAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffSpecialAvailability" ADD CONSTRAINT "StaffSpecialAvailability_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSpecialAvailability" ADD CONSTRAINT "StaffSpecialAvailability_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
