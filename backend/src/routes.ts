import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { checkLanguage } from "./checkLanguage.js";
import { Match } from "./db/entities/Match.js";
import { Message } from "./db/entities/Message.js";
import {User} from "./db/entities/User.js";
import {ICreateUsersBody} from "./types.js";

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
		return 'hello';
	});
	
	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});
	

	
	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });
	
	// CRUD
	// C
	app.post<{Body: ICreateUsersBody}>("/users", async (req, reply) => {
		const { name, email, petType} = req.body;
		
		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType
			});

			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});
	
	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// UPDATE
	app.put<{Body: ICreateUsersBody}>("/users", async(req, reply) => {
		const { name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});
	
	// DELETE
	app.delete<{ Body: {email, pass}}>("/users", async(req, reply) => {
		const { email, pass } = req.body;

		if (process.env.ADMIN_PASS !== pass){
			return reply.status(500).send("Denied Delete");
		}
		
		try {
			const theUser = await req.em.findOne(User, { email },
				{populate: [
					"matches",
					"matched_by",
					"from",
					"to"
				]});

				if (theUser.from.isInitialized()){
					await req.em.remove(theUser).flush();
					console.log(theUser);
					reply.send(theUser);	
				}
				else {
					const user = req.em.getReference(User, email);
					await req.em.remove(user).flush();
					console.log(theUser);
					reply.send(theUser);	
				}
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// CREATE MATCH ROUTE
	app.post<{Body: { email: string, matchee_email: string }}>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});

    // CREATE MESSAGE
	app.post<{Body: { sender: string, receiver: string, message: string }}>("/messages", async (req, reply) => {
		const { sender, receiver, message} = req.body;
        const add = checkLanguage(message);
		console.log(add);
		if (add == false){ return reply.status(500).send("You used a Bad word!");}
		
		try {

			// make sure that the matchee exists & get their user account
			const from_sender = await req.em.findOne(User, { email: sender });
			// do the same for the matcher/owner
			const to_receiver = await req.em.findOne(User, { email: receiver });

			//create a new match between them
			const newMatch = await req.em.create(Message, {
				from_sender,
				to_receiver,
				message
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});

		// UPDATE MESSAGE
		app.put<{Body: {messageId: number ,message: string}}>("/messages", async(req, reply) => {
			const { messageId, message} = req.body;
			
			const messageToChange = await req.em.findOne(Message, {id: messageId});
			messageToChange.message = message;
			
			
			// Reminder -- this is how we persist our JS object changes to the database itself
			await req.em.flush();
			console.log(messageToChange);
			reply.send(messageToChange);
			
		});

		//READ MESSAGES SENT
	app.search("/messages/sent", async (req, reply) => {
		const { sender } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email: sender });
			const theMessages = await req.em.find(Message, {from_sender: theUser.id})
			console.log(theMessages);
			reply.send(theMessages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

		//READ MESSAGES RECEIVED
		app.search("/messages", async (req, reply) => {
			const { receiver } = req.body;
			
			try {
				const theUser = await req.em.findOne(User, { email: receiver });
				const theMessages = await req.em.find(Message, {from_sender: theUser.id})
				console.log(theMessages);
				reply.send(theMessages);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		});


    // GET ALL MESSAGES for my sanity

	app.get("/messages", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(Message, {});
	});

	// DELETE MESSAGE
	app.delete<{ Body: {messageId: number, pass: string }}>("/messages", async(req, reply) => {
		const { messageId, pass } = req.body;
		
		if (process.env.ADMIN_PASS !== pass){
			return reply.status(500).send("Denied Delete");
		}
		try {
			const messageDelete = await req.em.findOne(Message, { id: messageId });
			
			await req.em.remove(messageDelete).flush();
			console.log(messageDelete);
			reply.send(messageDelete);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// DELETE ALL MESSAGES I SENT
	app.delete<{ Body: {sender: string, pass: string}}>("/messages/all", async(req, reply) => {
		const { sender, pass } = req.body;

		if (process.env.ADMIN_PASS !== pass){
			return reply.status(500).send("Denied Delete");
		}	
		try {
			const theUser = await req.em.findOne(User, { email: sender });
			const theMessages = await req.em.find(Message, {from_sender: theUser.id})
			await req.em.remove(theMessages).flush();
			console.log(theMessages);
			reply.send(theMessages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
}

export default DoggrRoutes;
