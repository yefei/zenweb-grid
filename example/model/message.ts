import { Model } from 'zenorm';
import { MessageTable } from './_tables.js';

@Model({
  pk: 'id',
  table: 'message',
})
export default class Message extends MessageTable {
}
