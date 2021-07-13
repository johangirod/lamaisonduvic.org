import barnumBar from '../../static/images/gallerie/barnumBar.jpg?w=400;640;768&format=webp&srcset';
import barnumTable from '../../static/images/gallerie/barnumTable.jpg?w=400;640;768&format=webp&srcset';
import chats from '../../static/images/gallerie/chats.jpg?w=400;640;768&format=webp&srcset';
import cuisine from '../../static/images/gallerie/cuisine.jpg?w=400;640;768&format=webp&srcset';
import entree from '../../static/images/gallerie/entree.jpg?w=400;640;768&format=webp&srcset';
import repasSoir from '../../static/images/gallerie/repasSoir.jpg?w=400;640;768&format=webp&srcset';
import salleZen from '../../static/images/gallerie/salleZen.jpg?w=400;640;768&format=webp&srcset';
import salon from '../../static/images/gallerie/salon.jpg?w=400;640;768&format=webp&srcset';
import maisonVic from '../../static/images/maisonVic.jpg?w=400;640;800&format=webp&srcset';
export const photosAsso = [
	{
		srcset: barnumTable,
		alt:
			'Des personnes attablées sous un barnum pendant une fête dans le jardin de la maison du Vic'
	},
	{
		srcset: repasSoir,
		alt: 'Un repas du soir chaleureux dans la cuisine de la maison du Vic'
	},
	{
		srcset: barnumBar,
		alt:
			"Des personnes sous un barnum dans le jardin de la maison du vic, autour d'un bar artisanal"
	}
];

export const photosMaison = [
	{
		srcset: entree,
		alt:
			"La facade principale de la maison du Vic, avec la porte d'entrée, un petit banc et une table et quatre chaise."
	},
	{
		srcset: cuisine,
		alt:
			"La cuisine de la maison du Vic, avec un four, un lave vaisselle et une fenêtre au dessus de l'évier"
	},
	{
		srcset: salon,
		alt: 'Le salon de la maison, avec une cheminée et un canapé'
	},
	{
		srcset: salleZen,
		alt:
			'Trois personnes qui discutent dans la grande salle Zen, sitée au dernier étage de la maison du Vic'
	},
	{
		srcset: chats,
		alt: 'Deux petits chats à côté du puits dans le jardin de la maison'
	}
];

export const photoMaisonVic = {
	srcset: maisonVic,
	alt: 'Vue du hameau de la Maison du Vic',
	sizes: '(max-width: 400px) 400px, (max-width: 640px) 640px, 800px'
};
