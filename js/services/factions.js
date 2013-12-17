'use strict';

angular.module('grudgeApp.services')
    .value('factions', 
{"cygnar":{"name":"Cygnar","casters":{"blaize":{"name":"Constance Blaize, Knight of the Prophet"},"siege":{"name":"Major Markus 'Siege' Brisbane"},"caine1":{"name":"Lieutenant Allister Caine"},"caine2":{"name":"Captain Allister Caine"},"darius":{"name":"Captain E. Dominic Darius"},"haley1":{"name":"Captain Victoria Haley"},"haley2":{"name":"Major Victoria Haley"},"kraye":{"name":"Captain Jeremiah Kraye"},"nemo1":{"name":"Commander Adept Sebastian Nemo"},"nemo2":{"name":"General Adept Sebastian Nemo"},"nemo3":{"name":"Artificer General Nemo"},"sloan":{"name":"Captain Kara Sloan"},"stryker1":{"name":"Commander Coleman Stryker"},"stryker2":{"name":"Lord Commander Stryker"},"sturgis1":{"name":"Commander Dalin Sturgis"}},"icon":"cygnar.png"},"menoth":{"name":"The Protectorate of Menoth","casters":{"kreoss1":{"name":"High Exemplar Kreoss"},"kreoss2":{"name":"Grand Exemplar Kreoss"},"kreoss3":{"name":"Intercessor Kreoss"},"reclaimer":{"name":"High Reclaimer"},"testament":{"name":"Testament of Menoth"},"severius1":{"name":"Grand Scrutator Severius"},"severius2":{"name":"Hierarch Severius"},"feora1":{"name":"Feora, Priestess of the Flame"},"feora2":{"name":"Feora, Protector of the Flame"},"amon":{"name":"High Allegiant Amon Ad'Raza"},"harbinger":{"name":"Harbinger of Menoth"},"reznik":{"name":"High Executioner Servath Reznik"},"vindictus":{"name":"Vice Scrutator Vindictus"},"thyra":{"name":"Thyra, Flame of Sorrow"}},"icon":"menoth.png"},"khador":{"name":"Khador","casters":{"butcher1":{"name":"Orsus Zoktavir, Butcher of Khardov"},"butcher2":{"name":"Kommander Orsus Zoktavir"},"sorscha1":{"name":"Kommander Sorscha Kratikoff"},"sorscha2":{"name":"Forward Kommander Sorscha Kratikoff"},"vlad1":{"name":"Vladimir Tzepesci, The Dark Prince"},"vlad2":{"name":"Vladimir Tzepesci, The Dark Champion"},"vlad3":{"name":"Vladimir Tzepesci, Great Prince of Umbrey"},"irusk1":{"name":"Kommandant Irusk"},"irusk2":{"name":"Supreme Kommandant Irusk"},"zerkova":{"name":"Koldun Kommander Aleksandra Zerkova"},"karchev":{"name":"Karchev the Terrible"},"the old witch":{"name":"Zevanna Agha, Old Witch of Khador"},"strakhov":{"name":"Kommander Strakhov"},"harkevich":{"name":"Kommander Harkevich, The Iron Wolf"},"butcher3":{"name":"Kommander Zoktavir, The Butcher Unleashed"}},"icon":"khador.png"},"cryx":{"name":"Cryx","casters":{"asphyxious1":{"name":"Iron Lich Asphyxious"},"asphyxious2":{"name":"Lich Lord Asphyxious"},"asphyxious3":{"name":"Asphyxious the Hellbringer"},"deneghra1":{"name":"War Witch Deneghra"},"deneghra2":{"name":"Wraith Witch Deneghra"},"goreshade1":{"name":"Goreshade the Bastard"},"goreshade2":{"name":"Goreshade the Cursed"},"mortenebra":{"name":"Master Necrotech Mortenebra"},"scaverous":{"name":"Lord Exhumator Scaverous"},"skarre1":{"name":"Skarre, the Pirate Queen"},"skarre2":{"name":"Skarre, Queen of the Broken Coast"},"terminus":{"name":"Lich Lord Terminus"},"venethrax":{"name":"Lich Lord Venethrax"},"witch coven":{"name":"The Witch Coven of Garlghast"},"sturgis2":{"name":"Sturgis the Corrupted"}},"icon":"cryx.png"},"scyrah":{"name":"Retribution of Scyrah","casters":{"garryth":{"name":"Garryth, Blade of Retribution"},"kaelyssa":{"name":"Kaelyssa, Night's Whisper"},"ossyan":{"name":"Lord Arcanist Ossyan"},"rahn":{"name":"Adeptis Rahn"},"ravyn":{"name":"Ravyn, Eternal Light"},"vyros1":{"name":"Dawnlord Vyros"},"vyros2":{"name":"Vyros, Incissar of the Dawnguard"},"issyria":{"name":"Issyria, Sibyl of Dawn"}},"icon":"scyrah.png"},"highborn":{"name":"Highborn Covenant","casters":{"ashlynn":{"name":"Ashlynn D'Elyse"},"bartolo":{"name":"Captain Bartolo Montador"},"damiano":{"name":"Captain Damiano"},"blaize":{"name":"Constance Blaize, Knight of the Prophet"},"macbain":{"name":"Drake MacBain"},"madhammer":{"name":"Durgen Madhammer"},"fiona":{"name":"Fiona the Black"},"ossrum":{"name":"General Ossrum"},"gorten":{"name":"Gorten Grundback"}},"icon":"mercs.png"},"seaforge":{"name":"Searforge Commission","casters":{"madhammer":{"name":"Durgen Madhammer"},"ossrum":{"name":"General Ossrum"},"gorten":{"name":"Gorten Grundback"}},"icon":"mercs.png"},"talion":{"name":"Talion Charter","casters":{"bartolo":{"name":"Captain Bartolo Montador"},"fiona":{"name":"Fiona the Black"},"shae":{"name":"Captain Phinneus Shae"}},"icon":"mercs.png"},"fourstar":{"name":"Four Star Syndicate","casters":{"bartolo":{"name":"Captain Bartolo Montador"},"damiano":{"name":"Captain Damiano"},"macbain":{"name":"Drake MacBain"},"madhammer":{"name":"Durgen Madhammer"},"ossrum":{"name":"General Ossrum"},"gorten":{"name":"Gorten Grundback"},"fiona":{"name":"Fiona the Black"},"magnus1":{"name":"Magnus the Traitor"},"magnus2":{"name":"Magnus the Warlord"}},"icon":"mercs.png"},"troll":{"name":"Trollbloods","casters":{"borka":{"name":"Borka Kegslayer"},"calandra":{"name":"Calandra Truthsayer, Oracle of the Glimmerwood"},"grim1":{"name":"Grim Angus"},"grissel1":{"name":"Grissel Bloodsong"},"grissel2":{"name":"Grissel Bloodsong, Marshal of the Kriels"},"gunnbjorn":{"name":"Captain Gunnbjorn"},"doomshaper1":{"name":"Hoarluk Doomshaper, Shaman of the Gnarls"},"doomshaper2":{"name":"Hoarluk Doomshaper, Rage of Dhunia"},"jarl":{"name":"Jarl Skuld, Devil of the Thornwood"},"madrak1":{"name":"Chief Madrak Ironhide"},"madrak2":{"name":"Madrak Ironhide, World Ender"},"grim2":{"name":"Hunters Grim"}},"icon":"troll.png"},"circle":{"name":"Circle Orboros","casters":{"baldur1":{"name":"Baldur the Stonecleaver"},"baldur2":{"name":"Baldur the Stonesoul"},"cassius":{"name":"Cassius the Oathkeeper & Wurmwood, Tree of Fate"},"grayle":{"name":"Grayle the Farstrider"},"kaya1":{"name":"Kaya the Wildborne"},"kaya2":{"name":"Kaya the Moonhunter and Laris"},"kromac":{"name":"Kromac the Ravenous"},"krueger1":{"name":"Krueger the Stormwrath"},"krueger2":{"name":"Krueger the Stormlord"},"mohsar":{"name":"Mohsar the Desertwalker"},"morvahna1":{"name":"Morvahna the Autumnblade"},"morvahna2":{"name":"Morvahna the Dawnshadow"}},"icon":"circle.png"},"skorne":{"name":"Skorne","casters":{"hexeris1":{"name":"Lord Tyrant Hexeris"},"hexeris2":{"name":"Lord Arbiter Hexeris"},"makeda1":{"name":"Archdomina Makeda"},"makeda2":{"name":"Supreme Archdomina Makeda"},"mordikaar":{"name":"Void Seer Mordikaar"},"morghoul1":{"name":"Master Tormentor Morghoul"},"morghoul2":{"name":"Lord Assassin Morghoul"},"naaresh":{"name":"Master Ascetic Naaresh"},"rasheth":{"name":"Dominar Rasheth"},"xerxis":{"name":"Tyrant Xerxis"},"zaal":{"name":"Supreme Aptimus Zaal"},"makeda3":{"name":"Makeda & the Exalted Court"}},"icon":"skorne.png"},"loe":{"name":"Legion of Everblight","casters":{"absylonia":{"name":"Absylonia, Terror of Everblight"},"bethayne":{"name":"Bethayne, Voice of Everblight"},"kallus":{"name":"Kallus, Wrath of Everblight"},"lylyth1":{"name":"Lylyth, Herald of Everblight"},"lylyth2":{"name":"Lylyth, Shadow of Everblight"},"rhyas":{"name":"Rhyas, Sigil of Everblight"},"saeryn":{"name":"Saeryn, Omen of Everblight"},"thagrosh1":{"name":"Thagrosh, Prophet of Everblight"},"thagrosh2":{"name":"Thagrosh, Messiah of Everblight"},"vayl1":{"name":"Vayl, Disciple of Everblight"},"vayl2":{"name":"Vayl, Consul of Everblight"},"lylyth3":{"name":"Lylyth, Reckoning of Everblight"}},"icon":"loe.png"},"blindwater":{"name":"Blindwater Congregation","casters":{"barnabas":{"name":"Bloody Barnabas"},"calaban":{"name":"Calaban the Gravewalker"},"maelok":{"name":"Maelok the Dreadbound"},"rask":{"name":"Rask"}},"icon":"minions.png"},"thornfall":{"name":"Thornfall Alliance","casters":{"carver":{"name":"Lord Carver, BMMD, Esq III"},"arkadius":{"name":"Dr. Arkadius"},"sturm & drang":{"name":"Sturm & Drang"},"midas":{"name":"Midas"}},"icon":"minions.png"},"mercs":{"name":"Mercenary Theme Forces","casters":{"ashlynn":{"name":"Ashlynn D'Elyse"},"bartolo":{"name":"Captain Bartolo Montador"},"damiano":{"name":"Captain Damiano"},"shae":{"name":"Captain Phinneus Shae"},"macbain":{"name":"Drake MacBain"},"madhammer":{"name":"Durgen Madhammer"},"ossrum":{"name":"General Ossrum"},"gorten":{"name":"Gorten Grundback"},"fiona":{"name":"Fiona the Black"},"magnus1":{"name":"Magnus the Traitor"},"magnus2":{"name":"Magnus the Warlord"}},"icon":"mercs.png"},"minions":{"name":"Minion Theme Forces","casters":{"barnabas":{"name":"Bloody Barnabas"},"calaban":{"name":"Calaban the Gravewalker"},"arkadius":{"name":"Dr. Arkadius"},"carver":{"name":"Lord Carver, BMMD, Esq III"},"maelok":{"name":"Maelok the Dreadbound"},"sturm & drang":{"name":"Sturm & Drang"},"rask":{"name":"Rask"},"midas":{"name":"Midas"}},"icon":"minions.png"},"cyriss":{"name":"Convergence of Cyriss","casters":{"aurora":{"name":"Aurora, Numen of Aerogenesis"},"axis":{"name":"Axis, the Harmonic Enforcer"},"directrix":{"name":"Iron Mother Directrix & Exponent Servitors"},"lucant":{"name":"Father Lucant, Divinity Architect"},"syntherion":{"name":"Forge Master Syntherion"}},"icon":"cyriss.png"}}
);
