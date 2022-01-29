import barnumBar from '../../static/images/gallerie/barnumBar.jpg?w=400;640;768&format=webp&srcset';
import barnumTable from '../../static/images/gallerie/barnumTable.jpg?w=400;640;768&format=webp&srcset';
import cuisine from '../../static/images/gallerie/cuisine.jpg?w=400;640;768&format=webp&srcset';
import entree from '../../static/images/gallerie/entree.jpg?w=400;640;768&format=webp&srcset';
import repasSoir from '../../static/images/gallerie/repasSoir.jpg?w=400;640;768&format=webp&srcset';
import salleZen from '../../static/images/gallerie/salleZen.jpg?w=400;640;768&format=webp&srcset';
import salleZen2 from '../../static/images/gallerie/salleZen2.jpg?w=400;640;768&format=webp&srcset';
import porteSalleZen from '../../static/images/gallerie/porteSalleZen.jpg?w=400;640;768&format=webp&srcset';
import salon from '../../static/images/gallerie/salon.jpg?w=400;640;768&format=webp&srcset';
import salon2 from '../../static/images/gallerie/salon2.jpg?w=400;640;768&format=webp&srcset';
import dortoir from '../../static/images/gallerie/dortoir.jpg?w=400;640;768&format=webp&srcset';
import planteFenetre from '../../static/images/gallerie/planteFenetre.jpg?w=400;640;768&format=webp&srcset';
import chambreRouge from '../../static/images/gallerie/chambreRouge.jpg?w=400;640;768&format=webp&srcset&rotate=90';
import tableLanger from '../../static/images/gallerie/tableLanger.jpg?w=400;640;768&format=webp&srcset&rotate=270';
import fenetreChambre from '../../static/images/gallerie/fenetreChambre.jpg?w=400;640;768&format=webp&srcset&rotate=90';
import bureau from '../../static/images/gallerie/bureau.jpg?w=400;640;768&format=webp&srcset';
import tortue from '../../static/images/gallerie/tortue.jpg?w=400;640;768&format=webp&srcset&rotate=90';
import panneau from '../../static/images/gallerie/panneau.jpg?w=400;640;768&format=webp&srcset';
import maisonVic from '../../static/images/maisonVic.jpg?w=400;640;800&format=webp&srcset';
export const photosAsso = [


	{
		srcset: repasSoir,
		alt: 'Un repas du soir chaleureux dans la cuisine de la maison du Vic'
	},
	{
		srcset: salleZen,
		alt:
			'Trois personnes qui discutent dans la grande salle Zen, sitée au dernier étage de la maison du Vic'
	},
	{
		srcset: barnumBar,
		alt:
			"Des personnes sous un barnum dans le jardin de la maison du vic, autour d'un bar artisanal"
	},
	{
		srcset: salon2,
		alt: 'Le salon de la maison du Vic, avec trois personnes qui échangent dans les canapés'
	}, {
		srcset: barnumTable,
		alt:
			'Des personnes attablées sous un barnum pendant une fête dans le jardin de la maison du Vic'
	},
];

export const photosMaison = [
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
		srcset: tableLanger,
		alt: "Une table à langer dans la salle d'eau au premier"
	},
	{
		srcset: chambreRouge,
		alt: 'Le lit double de la chambre rouge au premier étage de la maison du Vic'
	},
	{
		srcset: bureau,
		alt: 'Le bureau au premier étage avec une chaîne hifi, une chaise et un canapé'
	},
	{
		srcset: porteSalleZen,
		alt: 'Buffet et miroir devant la porte de la salle Zen'
	},
	{
		srcset: salleZen2,
		alt:
			'La grande salle Zen au deuxième étage'
	},
	{
		srcset: dortoir,
		alt: 'Le dortoir de la maison du Vic avec trois lits superposés'
	}
];


export const photosAutres = [
	{
		srcset: panneau,
		alt:
			"Un panneau avec inscrit 'La maison du Vic' dessus"
	},
	{
		srcset: tortue,
		alt:
			"La façade de la cuisine vue depuis le jardin"
	},
	{
		srcset: fenetreChambre,
		alt:
			"La vue depuis une fenêtre d'une chambre au premier étage"
	},
	{
		srcset: entree,
		alt:
			"La facade principale de la maison du Vic, avec la porte d'entrée, un petit banc et une table et quatre chaise."
	},
	{
		srcset: planteFenetre,
		alt:
			"Une plante devant la fenêtre du salon en hiver"
	},
];

export const photoMaisonVic = {
	srcset: maisonVic,
	alt: 'Vue depuis la Maison du Vic',
	sizes: '(max-width: 400px) 400px, (max-width: 640px) 640px, 800px'
};
