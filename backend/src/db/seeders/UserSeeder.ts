import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {User} from "../entities/User.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		context.person1 = em.create(User, {
			name: "Spot",
			email: "email@email.com",
			petType: "Dog",
			
		});

		context.person2 = em.create(User, {
			name: "Dogbert",
			email: "email2@email.com",
			petType: "Dog"
		});

		context.person3 = em.create(User, {
			name: "Doglord",
			email: "email3@email.com",
			petType: "Dog"
		});

		context.person4 = em.create(User, {
			name: "NotaDog",
			email: "email4@email.com",
			petType: "Cat"
		});
	}
}
