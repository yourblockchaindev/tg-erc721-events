import { exists, getCollections, add as dbAdd, remove as dbRemove } from "./db";
import Listener from "../chain/listener";
import { ICollection } from "../interfaces/ICollection";

let count = 0;
const listeners: Listener[] = [];

function createListener(collection: ICollection) {
  const id = count;
  const listener = new Listener(collection, id);
  listener.start();
  listeners.push(listener);
  count++;
}

function removeListener(listener: Listener) {
  listener.stop();
  const index = listeners.findIndex((l) => l.id == listener.id);
  listeners.splice(index);
}

function findListener(collection: ICollection) {
  return listeners.find((l) => l.collection === collection);
}

export async function add(collection: ICollection) {
  try {
    // check existance
    if (exists(collection)) {
    } else {
      // create listener
      createListener(collection);
      // add to db
      await dbAdd(collection);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function remove(collection: ICollection) {
  try {
    // remove from db
    await dbRemove(collection);
    // find listener
    const listener = findListener(collection);
    // remove listener
    if (listener !== undefined) {
      removeListener(listener);
    } else {
      console.warn(`Listener is undefined`, collection);
    }
  } catch (error) {
    console.error(error);
  }
}

export function run() {
  const collections: ICollection[] = getCollections();
  collections.forEach((collection) => createListener(collection));
}