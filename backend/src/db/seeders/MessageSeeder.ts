import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Message } from '../entities/Message.js';
import { User } from "../entities/User.js";

export class MessageSeeder extends Seeder {
    async run(em: EntityManager, context: Dictionary): Promise<void> {
        em.create(Message, {
            from_sender: context.person1,
            to_receiver: context.person2,
            message: "Hey there guy"
        }),
        em.create(Message, {
            from_sender: context.person2,
            to_receiver: context.person1,
            message: "I enjoyed our chat yesterday"
        })
        em.create(Message, {
            from_sender: context.person1,
            to_receiver: context.person2,
            message: "I like turtles"
        }),
        em.create(Message, {
            from_sender: context.person1,
            to_receiver: context.person4,
            message: "what is this all about?"
        }),
        em.create(Message, {
            from_sender: context.person2,
            to_receiver: context.person3,
            message: "hello good sir"
        }),
        em.create(Message, {
            from_sender: context.person4,
            to_receiver: context.person3,
            message: "would you like to hear a story"
        }),
        em.create(Message, {
            from_sender: context.person3,
            to_receiver: context.person2,
            message: "not really"
        })
    }
    
};
