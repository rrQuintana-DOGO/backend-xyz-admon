CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "client_configs" (
    "id_client_config" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_client" UUID,
    "id_platform_account" INTEGER,
    "platform_token" VARCHAR(255),
    "base_url" VARCHAR(255),

    CONSTRAINT "client_configs_pkey" PRIMARY KEY ("id_client_config")
);

-- CreateTable
CREATE TABLE "client_databases" (
    "id_client_database" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_client" UUID,
    "id_module" UUID,
    "database_token" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "client_databases_pkey" PRIMARY KEY ("id_client_database")
);

-- CreateTable
CREATE TABLE "clients" (
    "id_client" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_ext" VARCHAR(255),
    "id_sap" VARCHAR(255),
    "name" VARCHAR(255),
    "company_name" VARCHAR(255),
    "address" VARCHAR(255),
    "rfc" VARCHAR(255),
    "slug" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "credentials_xyz" (
    "id_credential_xyz" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(255),
    "password" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "credentials_xyz_pkey" PRIMARY KEY ("id_credential_xyz")
);

-- CreateTable
CREATE TABLE "credentials_xyz_has_clients" (
    "id_credential_xyz_has_client" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_credential_xyz" UUID,
    "id_client" UUID,

    CONSTRAINT "credentials_xyz_has_clients_pkey" PRIMARY KEY ("id_credential_xyz_has_client")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id_invoice" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_client" UUID,
    "id_subscription" UUID,
    "created_at" BIGINT,
    "url_doc" VARCHAR(255),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id_invoice")
);

-- CreateTable
CREATE TABLE "modules" (
    "id_module" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "cost" REAL,
    "status" BOOLEAN,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id_module")
);

-- CreateTable
CREATE TABLE "paid_methods" (
    "id_paid_method" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_stripe_payment_methodful" VARCHAR(255),
    "name" VARCHAR(255),
    "id_client" UUID,
    "status" BOOLEAN,

    CONSTRAINT "paid_methods_pkey" PRIMARY KEY ("id_paid_method")
);

-- CreateTable
CREATE TABLE "subscription_has_modules" (
    "id_subscription_has_module" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_module" UUID,
    "id_subscription" UUID,

    CONSTRAINT "subscription_has_modules_pkey" PRIMARY KEY ("id_subscription_has_module")
);

-- CreateTable
CREATE TABLE "subscription_tiers" (
    "id_subscription_tier" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "price" REAL,
    "status" BOOLEAN,

    CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id_subscription_tier")
);

-- CreateTable
CREATE TABLE "subscription_types" (
    "id_subscription_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "subscription_types_pkey" PRIMARY KEY ("id_subscription_type")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id_subscription" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_client" UUID,
    "id_subscription_stripe" VARCHAR(255),
    "id_subscription_type" UUID,
    "id_subscription_tier" UUID,
    "start_date" BIGINT,
    "expire_date" BIGINT,
    "status" BOOLEAN,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id_subscription")
);

-- AddForeignKey
ALTER TABLE "client_configs" ADD CONSTRAINT "client_configs_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_databases" ADD CONSTRAINT "client_databases_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_databases" ADD CONSTRAINT "client_databases_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "modules"("id_module") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credentials_xyz_has_clients" ADD CONSTRAINT "credentials_xyz_has_clients_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credentials_xyz_has_clients" ADD CONSTRAINT "credentials_xyz_has_clients_id_credential_xyz_fkey" FOREIGN KEY ("id_credential_xyz") REFERENCES "credentials_xyz"("id_credential_xyz") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_id_subscription_fkey" FOREIGN KEY ("id_subscription") REFERENCES "subscriptions"("id_subscription") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paid_methods" ADD CONSTRAINT "paid_methods_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscription_has_modules" ADD CONSTRAINT "subscription_has_modules_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "modules"("id_module") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscription_has_modules" ADD CONSTRAINT "subscription_has_modules_id_subscription_fkey" FOREIGN KEY ("id_subscription") REFERENCES "subscriptions"("id_subscription") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_id_subscription_tier_fkey" FOREIGN KEY ("id_subscription_tier") REFERENCES "subscription_tiers"("id_subscription_tier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_id_subscription_type_fkey" FOREIGN KEY ("id_subscription_type") REFERENCES "subscription_types"("id_subscription_type") ON DELETE NO ACTION ON UPDATE NO ACTION;
