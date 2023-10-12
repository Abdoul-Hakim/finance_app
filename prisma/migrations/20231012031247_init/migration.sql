-- CreateTable
CREATE TABLE "income" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "incomeType" INT4 NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "comment" STRING NOT NULL,
    "tCreated" INT8 NOT NULL,

    CONSTRAINT "income_pkey" PRIMARY KEY ("id")
);
