import { model } from 'zenorm';
import { MessageTable } from './_tables';

@model({
  pk: 'id',
  table: 'message',
})
export default class Message extends MessageTable {
}
