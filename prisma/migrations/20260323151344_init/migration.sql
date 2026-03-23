-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codename" TEXT,
    "backstory" TEXT,
    "attrs" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "talent" TEXT NOT NULL,
    "talentDesc" TEXT NOT NULL,
    "armor" TEXT NOT NULL,
    "weapons" JSONB NOT NULL,
    "expendables" JSONB NOT NULL,
    "bgTags" JSONB NOT NULL,
    "fatigue" INTEGER NOT NULL DEFAULT 0,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "clocks" JSONB NOT NULL DEFAULT '[]',
    "activeAuras" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
