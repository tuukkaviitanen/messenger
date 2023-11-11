const users = [
	{
		id: '1f234f34f2',
		username: 'hello',
	},
	{
		id: '1215f234fef',
		username: 'world',
	},
];

const getAll = () => users;

const getSingle = (id: string) => users.find(u => u.id === id);

const userService = {getAll, getSingle};

export default userService;
