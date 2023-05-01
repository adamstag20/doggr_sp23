import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { User } from "./User.js";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class Message extends BaseEntity{

	// The person who performed the match/swiped right
	@ManyToOne(()=> User)
	from_sender!: Rel<User>;

	// The account whose profile was swiped-right-on
	@ManyToOne(() => User)
	to_receiver!: Rel<User>;

	
	@Property()
	message: string;
}