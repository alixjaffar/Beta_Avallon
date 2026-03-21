-- SiteAsset: user-uploaded images stored in PostgreSQL (survives redeploys)
CREATE TABLE "SiteAsset" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteAsset_siteId_key_key" ON "SiteAsset"("siteId", "key");

CREATE INDEX "SiteAsset_siteId_idx" ON "SiteAsset"("siteId");

ALTER TABLE "SiteAsset" ADD CONSTRAINT "SiteAsset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
