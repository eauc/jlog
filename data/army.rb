#!/usr/bin/env ruby

require 'csv'
require 'json'

faction = {}
CSV.foreach("./faction.csv") do |row|
  faction[row[0].to_i] = { 
    name: row[1],
  }
end
faction[1][:id] = 'cygnar'
faction[2][:id] = 'menoth'
faction[3][:id] = 'khador'
faction[4][:id] = 'cryx'
faction[5][:id] = 'scyrah'
faction[6][:id] = 'highborn'
faction[7][:id] = 'seaforge'
faction[8][:id] = 'talion'
faction[9][:id] = 'fourstar'
faction[10][:id] = 'troll'
faction[11][:id] = 'circle'
faction[12][:id] = 'skorne'
faction[13][:id] = 'loe'
faction[14][:id] = 'blindwater'
faction[15][:id] = 'thornfall'
faction[16][:id] = 'mercs'
faction[17][:id] = 'minions'
faction[18][:id] = 'cyriss'
# p faction

caster = {}
CSV.foreach("./caster.csv") do |row|
  caster[row[0].to_i] = { 
    name: row[1],
    id: row[2].downcase
  }
end
# p caster

army = {}
CSV.foreach("./army.csv") do |row|
  army[row[0].to_i] = { 
    caster: caster[row[1].to_i],
    faction: faction[row[2].to_i]
  }
end
army[0] = army[1]
# p army

result = {}
faction.each do |id, f|
  result[f[:id]] = {
    name: f[:name],
    casters: {}
  }
end
result['cygnar']['icon'] = 'cygnar.png'
result['menoth']['icon'] = 'menoth.png'
result['khador']['icon'] = 'khador.png'
result['cryx']['icon'] = 'cryx.png'
result['scyrah']['icon'] = 'scyrah.png'
result['highborn']['icon'] = 'mercs.png'
result['seaforge']['icon'] = 'mercs.png'
result['talion']['icon'] = 'mercs.png'
result['fourstar']['icon'] = 'mercs.png'
result['troll']['icon'] = 'troll.png'
result['circle']['icon'] = 'circle.png'
result['skorne']['icon'] = 'skorne.png'
result['loe']['icon'] = 'loe.png'
result['blindwater']['icon'] = 'minions.png'
result['thornfall']['icon'] = 'minions.png'
result['mercs']['icon'] = 'mercs.png'
result['minions']['icon'] = 'minions.png'
result['cyriss']['icon'] = 'cyriss.png'

army.each do |id, a|
  result[a[:faction][:id]][:casters][a[:caster][:id]] = {
    name: a[:caster][:name]
  }
end
p result.to_json
