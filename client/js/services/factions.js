'use strict';

angular.module('jlogApp.services')
  .value('default_factions', 
         {
           'cephalyx': {
             'name': 'Cephalyx',
             'casters': {
               'thexus1': {'name': 'Exulon Thexus'}
             },
             'icon': 'mercs_50.png'
           },
           'cygnar': {
             'name': 'Cygnar',
             'casters': {
               'blaize': {'name': 'Constance Blaize,  Knight of the Prophet'},
               'siege': {'name': 'Major Markus \'Siege\' Brisbane'},
               'caine1': {'name': 'Lieutenant Allister Caine'},
               'caine2': {'name': 'Captain Allister Caine'},
               'darius': {'name': 'Captain E. Dominic Darius'},
               'haley1': {'name': 'Captain Victoria Haley'},
               'haley2': {'name': 'Major Victoria Haley'},
               'kraye': {'name': 'Captain Jeremiah Kraye'},
               'nemo1': {'name': 'Commander Adept Sebastian Nemo'},
               'nemo2': {'name': 'General Adept Sebastian Nemo'},
               'nemo3': {'name': 'Artificer General Nemo'},
               'sloan': {'name': 'Captain Kara Sloan'},
               'stryker1': {'name': 'Commander Coleman Stryker'},
               'stryker2': {'name': 'Lord Commander Stryker'},
               'stryker3': {'name': 'Lord General Coleman Stryker'},
               'sturgis1': {'name': 'Commander Dalin Sturgis'}
             },
             'icon': 'cygnar_50.png'
           },
           'menoth': {
             'name': 'The Protectorate of Menoth',
             'casters': {
               'kreoss1': {'name': 'High Exemplar Kreoss'},
               'kreoss2': {'name': 'Grand Exemplar Kreoss'},
               'kreoss3': {'name': 'Intercessor Kreoss'},
               'reclaimer': {'name': 'High Reclaimer'},
               'testament': {'name': 'Testament of Menoth'},
               'severius1': {'name': 'Grand Scrutator Severius'},
               'severius2': {'name': 'Hierarch Severius'},
               'feora1': {'name': 'Feora,  Priestess of the Flame'},
               'feora2': {'name': 'Feora,  Protector of the Flame'},
               'amon': {'name': 'High Allegiant Amon Ad\'Raza'},
               'harbinger': {'name': 'Harbinger of Menoth'},
               'reznik1': {'name': 'High Executioner Servath Reznik'},
               'reznik2': {'name': 'Servath Reznik, Wrath of Ages'},
               'vindictus': {'name': 'Vice Scrutator Vindictus'},
               'thyra': {'name': 'Thyra,  Flame of Sorrow'}
             },
             'icon': 'menoth_50.png'
           },
           'khador': {
             'name': 'Khador',
             'casters': {
               'butcher1': {'name': 'Orsus Zoktavir,  Butcher of Khardov'},
               'butcher2': {'name': 'Kommander Orsus Zoktavir'},
               'sorscha1': {'name': 'Kommander Sorscha Kratikoff'},
               'sorscha2': {'name': 'Forward Kommander Sorscha Kratikoff'},
               'vlad1': {'name': 'Vladimir Tzepesci,  The Dark Prince'},
               'vlad2': {'name': 'Vladimir Tzepesci,  The Dark Champion'},
               'vlad3': {'name': 'Vladimir Tzepesci,  Great Prince of Umbrey'},
               'irusk1': {'name': 'Kommandant Irusk'},
               'irusk2': {'name': 'Supreme Kommandant Irusk'},
               'zerkova': {'name': 'Koldun Kommander Aleksandra Zerkova'},
               'karchev': {'name': 'Karchev the Terrible'},
               'the old witch': {'name': 'Zevanna Agha,  Old Witch of Khador'},
               'strakhov': {'name': 'Kommander Strakhov'},
               'harkevich': {'name': 'Kommander Harkevich,  The Iron Wolf'},
               'butcher3': {'name': 'Kommander Zoktavir,  The Butcher Unleashed'}
             },
             'icon': 'khador_50.png'
           },
           'cryx': {
             'name': 'Cryx',
             'casters': {
               'asphyxious1': {'name': 'Iron Lich Asphyxious'},
               'asphyxious2': {'name': 'Lich Lord Asphyxious'},
               'asphyxious3': {'name': 'Asphyxious the Hellbringer'},
               'deneghra1': {'name': 'War Witch Deneghra'},
               'deneghra2': {'name': 'Wraith Witch Deneghra'},
               'goreshade1': {'name': 'Goreshade the Bastard'},
               'goreshade2': {'name': 'Goreshade the Cursed'},
               'goreshade3': {'name': 'Goreshade, Lord of Ruin'},
               'mortenebra': {'name': 'Master Necrotech Mortenebra'},
               'scaverous': {'name': 'Lord Exhumator Scaverous'},
               'skarre1': {'name': 'Skarre,  the Pirate Queen'},
               'skarre2': {'name': 'Skarre,  Queen of the Broken Coast'},
               'terminus': {'name': 'Lich Lord Terminus'},
               'venethrax': {'name': 'Lich Lord Venethrax'},
               'witch coven': {'name': 'The Witch Coven of Garlghast'},
               'sturgis2': {'name': 'Sturgis the Corrupted'}
             },
             'icon': 'cryx_50.png'
           },
           'scyrah': {
             'name': 'Retribution of Scyrah',
             'casters': {
               'garryth': {'name': 'Garryth,  Blade of Retribution'},
               'kaelyssa': {'name': 'Kaelyssa,  Night\'s Whisper'},
               'ossyan': {'name': 'Lord Arcanist Ossyan'},
               'rahn': {'name': 'Adeptis Rahn'},
               'ravyn': {'name': 'Ravyn,  Eternal Light'},
               'vyros1': {'name': 'Dawnlord Vyros'},
               'vyros2': {'name': 'Vyros,  Incissar of the Dawnguard'},
               'issyria': {'name': 'Issyria,  Sibyl of Dawn'}
             },
             'icon': 'scyrah_50.png'
           },
           'highborn': {
             'name': 'Highborn Covenant',
             'casters': {
               'ashlynn': {'name': 'Ashlynn D\'Elyse'},
               'bartolo': {'name': 'Captain Bartolo Montador'},
               'damiano': {'name': 'Captain Damiano'},
               'blaize': {'name': 'Constance Blaize,  Knight of the Prophet'},
               'macbain': {'name': 'Drake MacBain'},
               'madhammer': {'name': 'Durgen Madhammer'},
               'fiona': {'name': 'Fiona the Black'},
               'ossrum': {'name': 'General Ossrum'},
               'gorten': {'name': 'Gorten Grundback'}
             },
             'icon': 'mercs_50.png'
           },
           'seaforge': {
             'name': 'Searforge Commission',
             'casters': {
               'madhammer': {'name': 'Durgen Madhammer'},
               'ossrum': {'name': 'General Ossrum'},
               'gorten': {'name': 'Gorten Grundback'}
             },
             'icon': 'mercs_50.png'
           },
           'talion': {
             'name': 'Talion Charter',
             'casters': {
               'bartolo': {'name': 'Captain Bartolo Montador'},
               'fiona': {'name': 'Fiona the Black'},
               'shae': {'name': 'Captain Phinneus Shae'}
             },
             'icon': 'mercs_50.png'
           },
           'fourstar': {
             'name': 'Four Star Syndicate',
             'casters': {
               'bartolo': {'name': 'Captain Bartolo Montador'},
               'damiano': {'name': 'Captain Damiano'},
               'macbain': {'name': 'Drake MacBain'},
               'madhammer': {'name': 'Durgen Madhammer'},
               'ossrum': {'name': 'General Ossrum'},
               'gorten': {'name': 'Gorten Grundback'},
               'fiona': {'name': 'Fiona the Black'},
               'magnus1': {'name': 'Magnus the Traitor'},
               'magnus2': {'name': 'Magnus the Warlord'}
             },
             'icon': 'mercs_50.png'
           },
           'troll': {
             'name': 'Trollbloods',
             'casters': {
               'borka1': {'name': 'Borka Kegslayer'},
               'borka2': {'name': 'Borka, Vengeance of the Rimeshaws'},
               'calandra': {'name': 'Calandra Truthsayer,  Oracle of the Glimmerwood'},
               'grim1': {'name': 'Grim Angus'},
               'grissel1': {'name': 'Grissel Bloodsong'},
               'grissel2': {'name': 'Grissel Bloodsong,  Marshal of the Kriels'},
               'gunnbjorn': {'name': 'Captain Gunnbjorn'},
               'doomshaper1': {'name': 'Hoarluk Doomshaper,  Shaman of the Gnarls'},
               'doomshaper2': {'name': 'Hoarluk Doomshaper,  Rage of Dhunia'},
               'jarl': {'name': 'Jarl Skuld,  Devil of the Thornwood'},
               'madrak1': {'name': 'Chief Madrak Ironhide'},
               'madrak2': {'name': 'Madrak Ironhide,  World Ender'},
               'grim2': {'name': 'Hunters Grim'}
             },
             'icon': 'troll_50.png'
           },
           'circle': {
             'name': 'Circle Orboros',
             'casters': {
               'baldur1': {'name': 'Baldur the Stonecleaver'},
               'baldur2': {'name': 'Baldur the Stonesoul'},
               'bradigus1': {'name': 'Haribo Dragibus'},
               'cassius': {'name': 'Cassius the Oathkeeper & Wurmwood,  Tree of Fate'},
               'grayle': {'name': 'Grayle the Farstrider'},
               'kaya1': {'name': 'Kaya the Wildborne'},
               'kaya2': {'name': 'Kaya the Moonhunter and Laris'},
               'kromac': {'name': 'Kromac the Ravenous'},
               'krueger1': {'name': 'Krueger the Stormwrath'},
               'krueger2': {'name': 'Krueger the Stormlord'},
               'mohsar': {'name': 'Mohsar the Desertwalker'},
               'morvahna1': {'name': 'Morvahna the Autumnblade'},
               'morvahna2': {'name': 'Morvahna the Dawnshadow'}
             },
             'icon': 'circle_50.png'
           },
           'skorne': {
             'name': 'Skorne',
             'casters': {
               'hexeris1': {'name': 'Lord Tyrant Hexeris'},
               'hexeris2': {'name': 'Lord Arbiter Hexeris'},
               'makeda1': {'name': 'Archdomina Makeda'},
               'makeda2': {'name': 'Supreme Archdomina Makeda'},
               'mordikaar': {'name': 'Void Seer Mordikaar'},
               'morghoul1': {'name': 'Master Tormentor Morghoul'},
               'morghoul2': {'name': 'Lord Assassin Morghoul'},
               'naaresh': {'name': 'Master Ascetic Naaresh'},
               'rasheth': {'name': 'Dominar Rasheth'},
               'xerxis1': {'name': 'Tyrant Xerxis'},
               'xerxis2': {'name': 'Xerxis Fury of Halaak'},
               'zaal': {'name': 'Supreme Aptimus Zaal'},
               'makeda3': {'name': 'Makeda & the Exalted Court'}
             },
             'icon': 'skorne_50.png'
           },
           'loe': {
             'name': 'Legion of Everblight',
             'casters': {
               'absylonia1': {'name': 'Absylonia,  Terror of Everblight'},
               'absylonia2': {'name': 'Absylonia,  Daughter of Everblight'},
               'bethayne': {'name': 'Bethayne,  Voice of Everblight'},
               'kallus': {'name': 'Kallus,  Wrath of Everblight'},
               'lylyth1': {'name': 'Lylyth,  Herald of Everblight'},
               'lylyth2': {'name': 'Lylyth,  Shadow of Everblight'},
               'rhyas': {'name': 'Rhyas,  Sigil of Everblight'},
               'saeryn': {'name': 'Saeryn,  Omen of Everblight'},
               'thagrosh1': {'name': 'Thagrosh,  Prophet of Everblight'},
               'thagrosh2': {'name': 'Thagrosh,  Messiah of Everblight'},
               'vayl1': {'name': 'Vayl,  Disciple of Everblight'},
               'vayl2': {'name': 'Vayl,  Consul of Everblight'},
               'lylyth3': {'name': 'Lylyth,  Reckoning of Everblight'}
             },
             'icon': 'loe_50.png'
           },
           'blindwater': {
             'name': 'Blindwater Congregation',
             'casters': {
               'barnabas': {'name': 'Bloody Barnabas'},
               'calaban': {'name': 'Calaban the Gravewalker'},
               'maelok': {'name': 'Maelok the Dreadbound'},
               'jaga1': {'name': 'Jaga-Jaga, the Death Charmer'},
               'rask': {'name': 'Rask'}
             },
             'icon': 'minions_50.png'
           },
           'thornfall': {
             'name': 'Thornfall Alliance',
             'casters': {
               'carver': {'name': 'Lord Carver,  BMMD,  Esq III'},
               'helga': {'name': 'Helga, the Conqueror'},
               'arkadius': {'name': 'Dr. Arkadius'},
               'sturm & drang': {'name': 'Sturm & Drang'},
               'midas': {'name': 'Midas'}
             },
             'icon': 'minions_50.png'
           },
           'mercs': {
             'name': 'Mercenary Theme Forces',
             'casters': {
               'ashlynn': {'name': 'Ashlynn D\'Elyse'},
               'bartolo': {'name': 'Captain Bartolo Montador'},
               'damiano': {'name': 'Captain Damiano'},
               'shae': {'name': 'Captain Phinneus Shae'},
               'macbain': {'name': 'Drake MacBain'},
               'madhammer': {'name': 'Durgen Madhammer'},
               'ossrum': {'name': 'General Ossrum'},
               'gorten': {'name': 'Gorten Grundback'},
               'fiona': {'name': 'Fiona the Black'},
               'magnus1': {'name': 'Magnus the Traitor'},
               'magnus2': {'name': 'Magnus the Warlord'},
               'thexus1': {'name': 'Exulon Thexus'}
             },
             'icon': 'mercs_50.png'
           },
           'minions': {
             'name': 'Minion Theme Forces',
             'casters': {
               'barnabas': {'name': 'Bloody Barnabas'},
               'calaban': {'name': 'Calaban the Gravewalker'},
               'arkadius': {'name': 'Dr. Arkadius'},
               'carver': {'name': 'Lord Carver,  BMMD,  Esq III'},
               'helga': {'name': 'Helga, the Conqueror'},
               'jaga1': {'name': 'Jaga-Jaga, the Death Charmer'},
               'maelok': {'name': 'Maelok the Dreadbound'},
               'sturm & drang': {'name': 'Sturm & Drang'},
               'rask': {'name': 'Rask'},
               'midas': {'name': 'Midas'}
             },
             'icon': 'minions_50.png'
           },
           'cyriss': {
             'name': 'Convergence of Cyriss',
             'casters': {
               'aurora': {'name': 'Aurora,  Numen of Aerogenesis'},
               'axis': {'name': 'Axis,  the Harmonic Enforcer'},
               'directrix': {'name': 'Iron Mother Directrix & Exponent Servitors'},
               'lucant': {'name': 'Father Lucant,  Divinity Architect'},
               'syntherion': {'name': 'Forge Master Syntherion'}
             },
             'icon': 'cyriss_50.png'
           }
         })
  .service('factions', [ 'default_factions', function(default_factions) {
    function normaliseCaster(caster) {
      if (!angular.isString(caster)) return null;
      var last_char = caster.charAt(caster.length - 1);
      if ('0' > last_char || '9' < last_char) {
        caster += '1';
      }
      return caster;
    }
    var factions = {};
    _.each(default_factions, function(faction, faction_key) {
      factions[faction_key] = {
        'name': faction.name,
        'icon': faction.icon,
        'casters': {}
      };
      _.each(faction.casters, function(caster, caster_key) {
        var normed_caster_key = normaliseCaster(caster_key);
        factions[faction_key].casters[normed_caster_key] = caster;
      });
    });
    // console.log(factions);
    return factions;
  }]);
