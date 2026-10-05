const users = [
	{
		id: 1,
		name: "Aziz",
		email: "aziz@gmail.com"
	},
	{
		id: 2,
		name: "jegham",
		email: "jegham@gmail.com"
	},
	{
		id: 3,
		name: "louay",
		email: "louay@gmail.com"
	}
];
let prochainId = 4;

const getAllUsers = (req, res) => {
	const { name } = req.query;

	let resultat = users;

	if (name) {
		resultat = users.filter(user => user.name === name);
	}

	res.json({
		total: resultat.length,
		users: resultat
	});
};

const getUserById = (req, res) => {
	const id = Number(req.params.id);

	const user = users.find(u => u.id === id);

	if (!user) {
		return res.status(404).json({
			error: `Utilisateur ${id} introuvable`
		});
	}

	res.status(200).json(user);
};

const createUser = (req, res) => {
	const { name, email } = req.body;

	if (!name || !email) {
		return res.status(400).json({
			error: "Le nom et l'email sont obligatoires"
		});
	}

	const nouvelUtilisateur = {
		id: prochainId,
		name,
		email
	};

	prochainId += 1;
	users.push(nouvelUtilisateur);

	res.status(201).json({
		message: "Utilisateur créé",
		user: nouvelUtilisateur
	});
};

const deleteUser = (req, res) => {
	const id = Number(req.params.id);
	const index = users.findIndex(user => user.id === id);

	if (index === -1) {
		return res.status(404).json({
			error: `Utilisateur ${id} introuvable`
		});
	}

	const utilisateurSupprime = users.splice(index, 1)[0];

	res.status(200).json({
		message: "Utilisateur supprimé",
		user: utilisateurSupprime
	});
};



module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser
};
