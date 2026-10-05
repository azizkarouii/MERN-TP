const { estNonVide, estEmailValide } = require('../utils/validators');

const users = [
	{
		id: 1,
		name: "Aziz",
		email: "aziz@gmail.com",
		role: "responsable"
	},
	{
		id: 2,
		name: "jegham",
		email: "jegham@gmail.com",
		role: "etudiant"
	},
	{
		id: 3,
		name: "louay",
		email: "louay@gmail.com",
		role: "etudiant"
	}
];
let prochainId = 4;

const getAllUsers = (req, res) => {
	const { role } = req.query;

	let resultat = users;

	if (role) {
		resultat = users.filter(user => user.role === role);
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
	const { name, email, role } = req.body;

	if (!estNonVide(name)) {
		return res.status(400).json({
			error: "Le nom est obligatoire et ne peut pas être vide"
		});
	}

	if (!estEmailValide(email)) {
		return res.status(400).json({
			error: "L'email est invalide. Il doit contenir @ et un point ."
		});
	}

	if (!role) {
		return res.status(400).json({
			error: "Le role est obligatoire"
		});
	}

	const nouvelUtilisateur = {
		id: prochainId,
		name,
		email,
		role
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
