import barnumBar from '../../static/images/gallerie/barnumBar.jpg?w=400;640;768&format=jpg&srcset';
import barnumTable from '../../static/images/gallerie/barnumTable.jpg?w=400;640;768&format=jpg&srcset';
import cuisine from '../../static/images/gallerie/cuisine.jpg?w=400;640;768&format=jpg&srcset';
import entree from '../../static/images/gallerie/entree.jpg?w=400;640;768&format=jpg&srcset';
import repasSoir from '../../static/images/gallerie/repasSoir.jpg?w=400;640;768&format=jpg&srcset';
import salleZen from '../../static/images/gallerie/salleZen.jpg?w=400;640;768&format=jpg&srcset';
import salleZen2 from '../../static/images/gallerie/salleZen2.jpg?w=400;640;768&format=jpg&srcset';
import porteSalleZen from '../../static/images/gallerie/porteSalleZen.jpg?w=400;640;768&format=jpg&srcset';
import salon from '../../static/images/gallerie/salon.jpg?w=400;640;768&format=jpg&srcset';
import salon2 from '../../static/images/gallerie/salon2.jpg?w=400;640;768&format=jpg&srcset';
import dortoir from '../../static/images/gallerie/dortoir.jpg?w=400;640;768&format=jpg&srcset';
import planteFenetre from '../../static/images/gallerie/planteFenetre.jpg?w=400;640;768&format=jpg&srcset';
import chambreRouge from '../../static/images/gallerie/chambreRouge.jpg?w=400;640;768&format=jpg&srcset&rotate=90';
import tableLanger from '../../static/images/gallerie/tableLanger.jpg?w=400;640;768&format=jpg&srcset&rotate=270';
import fenetreChambre from '../../static/images/gallerie/fenetreChambre.jpg?w=400;640;768&format=jpg&srcset&rotate=90';
import bureau from '../../static/images/gallerie/bureau.jpg?w=400;640;768&format=jpg&srcset';
import tortue from '../../static/images/gallerie/tortue.jpg?w=400;640;768&format=jpg&srcset&rotate=90';
import panneau from '../../static/images/gallerie/panneau.jpg?w=400;640;768&format=jpg&srcset';
import maisonVic from '../../static/images/maisonVic.jpg?w=400;640;800&format=jpg&srcset';

import FestiVic from '../../static/images/afficheFestivic.jpg?w=400;640;800&format=jpg&srcset';

export const photosAsso = [


	{
		srcset: repasSoir,
		alt: 'Un repas du soir chaleureux dans la cuisine de la maison du Vic'
	},
	{
		srcset: salleZen,
		alt:
			'Trois personnes qui discutent dans la grande salle Zen, sit??e au dernier ??tage de la maison du Vic'
	},
	{
		srcset: barnumBar,
		alt:
			"Des personnes sous un barnum dans le jardin de la maison du vic, autour d'un bar artisanal"
	},
	{
		srcset: salon2,
		alt: 'Le salon de la maison du Vic, avec trois personnes qui ??changent dans les canap??s'
	}, {
		srcset: barnumTable,
		alt:
			'Des personnes attabl??es sous un barnum pendant une f??te dans le jardin de la maison du Vic'
	},
];

export const photosMaison = [
	{
		srcset: cuisine,
		alt:
			"La cuisine de la maison du Vic, avec un four, un lave vaisselle et une fen??tre au dessus de l'??vier"
	},
	{
		srcset: salon,
		alt: 'Le salon de la maison, avec une chemin??e et un canap??'
	},
	{
		srcset: tableLanger,
		alt: "Une table ?? langer dans la salle d'eau au premier"
	},
	{
		srcset: chambreRouge,
		alt: 'Le lit double de la chambre rouge au premier ??tage de la maison du Vic'
	},
	{
		srcset: bureau,
		alt: 'Le bureau au premier ??tage avec une cha??ne hifi, une chaise et un canap??'
	},
	{
		srcset: porteSalleZen,
		alt: 'Buffet et miroir devant la porte de la salle Zen'
	},
	{
		srcset: salleZen2,
		alt:
			'La grande salle Zen au deuxi??me ??tage'
	},
	{
		srcset: dortoir,
		alt: 'Le dortoir de la maison du Vic avec trois lits superpos??s'
	}
];


export const photosAutres = [
	{
		srcset: planteFenetre,
		alt:
			"Une plante devant la fen??tre du salon en hiver"
	},

	{
		srcset: tortue,
		alt:
			"La fa??ade de la cuisine vue depuis le jardin"
	},
	{
		srcset: fenetreChambre,
		alt:
			"La vue depuis une fen??tre d'une chambre au premier ??tage"
	},
	{
		srcset: entree,
		alt:
			"La facade principale de la maison du Vic, avec la porte d'entr??e, un petit banc et une table et quatre chaise."
	},
	{
		srcset: panneau,
		alt:
			"Un panneau avec inscrit 'La maison du Vic' dessus"
	},

];

export const photoMaisonVic = {
	srcset: maisonVic,
	alt: 'Vue depuis la Maison du Vic',
	sizes: '(max-width: 400px) 400px, (max-width: 640px) 640px, 800px'
};

export const actualit??s = {
	FestiVic: {
		srcset: FestiVic,
		alt: "L'affiche du Festi'Vic 2022",
		sizes: '(max-width: 400px) 400px, (max-width: 640px) 640px, 800px'
	}
}