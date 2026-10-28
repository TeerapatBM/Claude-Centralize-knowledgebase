import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const conversations=sqliteTable('conversations',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),sourceId:text('source_id').notNull(),title:text('title').notNull(),person:text('person').notNull(),project:text('project').notNull(),source:text('source').notNull(),category:text('category').notNull(),messages:text('messages').notNull(),tokens:integer('tokens').notNull(),date:text('date').notNull(),importedAt:text('imported_at').notNull()
},t=>[index('conversation_owner').on(t.owner)]);
export const chunks=sqliteTable('chunks',{id:text('id').primaryKey(),conversationId:text('conversation_id').notNull().references(()=>conversations.id,{onDelete:'cascade'}),owner:text('owner').notNull(),text:text('text').notNull()},t=>[index('chunk_owner').on(t.owner)]);
export const tasks=sqliteTable('tasks',{id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),assignee:text('assignee').notNull(),status:text('status').notNull(),conversationId:text('conversation_id').references(()=>conversations.id,{onDelete:'cascade'}),createdAt:text('created_at').notNull()});
