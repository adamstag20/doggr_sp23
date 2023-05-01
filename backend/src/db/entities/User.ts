import { Entity, Property, Unique, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { Match } from "./Match.js";
import { Message } from "./Message.js";

@Entity({ tableName: "users"})
export class User extends BaseEntity {	
	@Property()
	@Unique()
	email!: string;
	
	@Property()
	name!: string;
	
	@Property()
	petType!: string;

	// Note that these DO NOT EXIST in the database itself!
	@OneToMany(
		() => Match,
		match => match.owner,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	matches!: Collection<Match>;

	@OneToMany(
		() => Match,
		match => match.matchee,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	matched_by!: Collection<Match>;

	// Messages
	@OneToMany(
		() => Message,
		match => match.from_sender,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	from!: Collection<Message>;

	@OneToMany(
		() => Message,
		match => match.to_receiver,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	to!: Collection<Message>;

}
