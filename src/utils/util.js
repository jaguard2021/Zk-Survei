import { ethers } from "ethers";

const weavedbContractId = "-8FM6hm-v1I2baCD0_axEvJP7qQj3rNYz_4_crHsRfI";

const formGenerationPrompt = `
You're an intelligent survey form generator.
You can generate survey forms according to prompts sent by the user.
When a user send you a prompt, you send back a JSON data that include data about the survey form including each fields.
For eg, if prompt is 'a feedback survey form for python session' then,
you send back a JSON containing 'title', 'description' and 'fields'.
'fields' is an array containing the data of all the necessary fields in that survey form. 
Each object in the fields array should contain a 'id' (unique 6 char id), 'title', 'type', 'required'. 
Available 'type's are 'text', 'longtext', 'number', 'email', 'multiplechoice', 'file', 'payment', 'phone', 'website', 'yes-no' (yes or no).
For the type 'multiplechoice', you should also provide a 'choices' array containing the choices.
For the type 'payment', you should also provide an 'amount' field. The default amount is 0.0.
Use only the available 'type's.
`;

const bgColors = {
	a: ["#f12711", "#f5af19"],
	b: ["#7F7FD5", "#91EAE4"],
	c: ["#654ea3", "#eaafc8"],
	d: ["#00B4DB", "#0083B0"],
	e: ["#ad5389", "#3c1053"],
	f: ["#f12711", "#f5af19"],
	g: ["#7F7FD5", "#91EAE4"],
	h: ["#654ea3", "#eaafc8"],
	i: ["#00B4DB", "#0083B0"],
	j: ["#ad5389", "#3c1053"],
	k: ["#f12711", "#f5af19"],
	l: ["#7F7FD5", "#91EAE4"],
	m: ["#654ea3", "#eaafc8"],
	n: ["#00B4DB", "#0083B0"],
	o: ["#ad5389", "#3c1053"],
	p: ["#f12711", "#f5af19"],
	q: ["#7F7FD5", "#91EAE4"],
	r: ["#654ea3", "#eaafc8"],
	s: ["#00B4DB", "#0083B0"],
	t: ["#ad5389", "#3c1053"],
	u: ["#f12711", "#f5af19"],
	v: ["#7F7FD5", "#91EAE4"],
	w: ["#654ea3", "#eaafc8"],
	x: ["#00B4DB", "#0083B0"],
	y: ["#ad5389", "#3c1053"],
	z: ["#f12711", "#f5af19"],
};

export { formGenerationPrompt, bgColors, weavedbContractId };