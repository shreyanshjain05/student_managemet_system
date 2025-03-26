-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleCurrent" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,

    CONSTRAINT "ScheduleCurrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursesPast" (
    "course_code" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "semester" TEXT NOT NULL,

    CONSTRAINT "CoursesPast_pkey" PRIMARY KEY ("course_code")
);

-- CreateTable
CREATE TABLE "CoursesCurrent" (
    "course_code" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "attendance_percentage" DOUBLE PRECISION NOT NULL,
    "instructor" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CoursesCurrent_pkey" PRIMARY KEY ("course_code")
);

-- CreateTable
CREATE TABLE "CourseMaterials" (
    "id" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CourseMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleEvents" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "ScheduleEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "submitted_date" TIMESTAMP(3),
    "grade" TEXT,
    "feedback" TEXT,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentsPast" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "AssignmentsPast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePersonal" (
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,

    CONSTRAINT "ProfilePersonal_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "ProfileAcademic" (
    "student_id" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "academic_status" TEXT NOT NULL,
    "enrollment_status" TEXT NOT NULL,
    "academic_advisor" TEXT NOT NULL,
    "advisor_email" TEXT NOT NULL,
    "expected_graduation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileAcademic_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "student_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL,
    "two_factor_enabled" BOOLEAN NOT NULL,
    "login_alerts_enabled" BOOLEAN NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "student_id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "font_size" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "UserNotifications" (
    "student_id" TEXT NOT NULL,
    "email_notifications" BOOLEAN NOT NULL,
    "browser_notifications" BOOLEAN NOT NULL,
    "assignment_notifications" BOOLEAN NOT NULL,
    "grade_notifications" BOOLEAN NOT NULL,
    "announcement_notifications" BOOLEAN NOT NULL,
    "event_notifications" BOOLEAN NOT NULL,

    CONSTRAINT "UserNotifications_pkey" PRIMARY KEY ("student_id")
);

-- AddForeignKey
ALTER TABLE "ScheduleCurrent" ADD CONSTRAINT "ScheduleCurrent_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleCurrent" ADD CONSTRAINT "ScheduleCurrent_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "CoursesCurrent"("course_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesPast" ADD CONSTRAINT "CoursesPast_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesCurrent" ADD CONSTRAINT "CoursesCurrent_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaterials" ADD CONSTRAINT "CourseMaterials_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "CoursesCurrent"("course_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleEvents" ADD CONSTRAINT "ScheduleEvents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "CoursesCurrent"("course_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentsPast" ADD CONSTRAINT "AssignmentsPast_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAcademic" ADD CONSTRAINT "ProfileAcademic_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuth" ADD CONSTRAINT "UserAuth_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "ProfilePersonal"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
