-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "authOId" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authOId_key" ON "public"."User"("authOId");
