import {PrismaClient} from '@prisma/client';
import {Decimal} from 'decimal.js';

const prisma = new PrismaClient();

async function seedInventory() {
  const seedUser = await prisma.user.create({
    data: {
      email: 'seed@system.local',
    },
  });

  const tshirt = await prisma.parentItem.create({
    data: {
      name: 'T-shirt',
    },
  });

  const pants = await prisma.parentItem.create({
    data: {
      name: 'Pants',
    },
  });

  const redShirt = await prisma.item.create({
    data: {
      parentItemId: tshirt.id,
      name: 'Red shirt',
      sku: 'sh-1',
      price: new Decimal(10),
      quantity: 10,
    },
  });

  const blueShirt = await prisma.item.create({
    data: {
      parentItemId: tshirt.id,
      name: 'Blue shirt',
      sku: 'sh-2',
      price: new Decimal(10),
      quantity: 10,
    },
  });

  const greenShirt = await prisma.item.create({
    data: {
      parentItemId: tshirt.id,
      name: 'Blue shirt',
      sku: 'sh-3',
      price: new Decimal(10),
      quantity: 10,
    },
  });

  const redPants = await prisma.item.create({
    data: {
      parentItemId: pants.id,
      name: 'Red pants',
      sku: 'pa-1',
      price: new Decimal(20),
      quantity: 10,
    },
  });

  const bluePants = await prisma.item.create({
    data: {
      parentItemId: pants.id,
      name: 'Blue pants',
      sku: 'pa-2',
      price: new Decimal(20),
      quantity: 10,
    },
  });

  const greenPants = await prisma.item.create({
    data: {
      parentItemId: pants.id,
      name: 'Gren pants',
      sku: 'pa-3',
      price: new Decimal(20),
      quantity: 10,
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      createdById: seedUser.id,
      vendorName: 'Levis',
      status: 'approved',
      orderDate: new Date(2023, 1, 1),
      expectedDeliveryDate: new Date(2023, 3, 10),
      lineItems: {
        create: [
          {itemId: redShirt.id, quantity: 10, unitCost: new Decimal(10)},
          {itemId: blueShirt.id, quantity: 10, unitCost: new Decimal(10)},
          {itemId: greenShirt.id, quantity: 10, unitCost: new Decimal(10)},
        ],
      },
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      createdById: seedUser.id,
      vendorName: 'Bonobos',
      status: 'approved',
      orderDate: new Date(2023, 2, 1),
      expectedDeliveryDate: new Date(2023, 4, 10),
      lineItems: {
        create: [
          {itemId: redPants.id, quantity: 10, unitCost: new Decimal(20)},
          {itemId: bluePants.id, quantity: 10, unitCost: new Decimal(20)},
          {itemId: greenPants.id, quantity: 10, unitCost: new Decimal(20)},
        ],
      },
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      createdById: seedUser.id,
      vendorName: 'Scotch and Soda',
      status: 'approved',
      orderDate: new Date(2023, 3, 1),
      expectedDeliveryDate: new Date(2023, 5, 10),
      lineItems: {
        create: [
          {itemId: redShirt.id, quantity: 10, unitCost: new Decimal(10)},
          {itemId: blueShirt.id, quantity: 10, unitCost: new Decimal(10)},
          {itemId: greenShirt.id, quantity: 10, unitCost: new Decimal(10)},
          {itemId: redPants.id, quantity: 10, unitCost: new Decimal(20)},
          {itemId: bluePants.id, quantity: 10, unitCost: new Decimal(20)},
          {itemId: greenPants.id, quantity: 10, unitCost: new Decimal(20)},
        ],
      },
    },
  });
}

async function seedRoles() {
  await prisma.role.upsert({
    where: {name: 'purchase_creator'},
    update: {},
    create: {
      name: 'purchase_creator',
      description: 'Can create purchase orders',
      permissions: {
        create: [
          {action: 'create', resource: 'purchase_order'},
          {action: 'read', resource: 'purchase_order'},
          {action: 'update', resource: 'purchase_order'},
        ],
      },
    },
  });

  await prisma.role.upsert({
    where: {name: 'purchase_approver'},
    update: {},
    create: {
      name: 'purchase_approver',
      description: 'Can approve and reject purchase orders',
      permissions: {
        create: [
          {action: 'read', resource: 'purchase_order'},
          {action: 'approve', resource: 'purchase_order'},
          {action: 'reject', resource: 'purchase_order'},
        ],
      },
    },
  });

  await prisma.role.upsert({
    where: {name: 'admin'},
    update: {},
    create: {
      name: 'admin',
      description: 'Full purchase order management',
      permissions: {
        create: [
          {action: 'create', resource: 'purchase_order'},
          {action: 'read', resource: 'purchase_order'},
          {action: 'update', resource: 'purchase_order'},
          {action: 'approve', resource: 'purchase_order'},
          {action: 'reject', resource: 'purchase_order'},
          {action: 'delete', resource: 'purchase_order'},
        ],
      },
    },
  });
}

async function load() {
  await seedInventory();
  await seedRoles();
}

load();
