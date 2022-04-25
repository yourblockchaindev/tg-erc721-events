import { ICollection } from "../interfaces/ICollection"
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

interface Data {
  collections: [];
}

const adapter: Data = new FileSync("db.json");
const db = low(adapter);

db.defaults({ collections: [] }).write();

// findIndex
export function findIndex(collection: ICollection): number {
  const index: number = db
    .get("collections")
    .findIndex(
      (c: ICollection) =>
        c.chatId == collection.chatId &&
        c.address.localeCompare(collection.address) == 0 &&
        c.chain.localeCompare(collection.chain) == 0
    );
  return index;
}

// check if exists
export function exists(collection: ICollection): boolean {
  const index: number = findIndex(collection);
  if (index == -1) {
    return false;
  } else {
    return true;
  }
}

// add
export async function add(collection: ICollection): Promise<boolean> {
  try {
    await db.get("collections").push(collection).write();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// remove
export async function remove(collection: ICollection) {
  try {
    const index: number = findIndex(collection);
    await db.get("collections").splice(index).write();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getChatCollections(chatId: bigInt.BigInteger): ICollection[] {
  return db.get("collections").filter((c: ICollection) => chatId.eq(c.chatId)).value()
}

export function getCollections(): ICollection[] {
  return db.get("collections").value()
}