#!/usr/bin/env ruby

require 'csv'
require 'json'

unless ARGV.length == 1
  p "Usage: #{$0} <file>"
  exit
end
unless File.readable?(ARGV[0])
  p "#{ARGV[0]} does not exist or is not readable"
  exit
end

score = {
  1 => 'va',
  2 => 'vs',
  7 => 'vc',
  -1 => 'da',
  -2 => 'ds',
  -7 => 'dc'
}

initiative = {
  0 => {
    dice: nil,
    start: nil
  },
  1 => {
    dice: true,
    start: true
  }
}

event = {}
CSV.foreach("./event.csv") do |row|
  event[row[0].to_i] = row[1]
end
# p event

scenario = {}
CSV.foreach("./scenario.csv") do |row|
  scenario[row[0].to_i] = row[1]
end
scenario[2] = "sr13incu"
scenario[6] = "sr13sad"
scenario[7] = "sr13cq"
scenario[8] = "sr13poe"
scenario[9] = "sr13inco"
scenario[10] = "sr13fs"
scenario[11] = "sr13out"
scenario[12] = "sr13ar"
scenario[13] = "sr13rp"
scenario[14] = "sr13des"
scenario[15] = "sr13itb"
scenario[16] = "sr13cr"
# p scenario

opponent = {}
CSV.foreach("./player.csv") do |row|
  opponent[row[0].to_i] = row[1]
end
# p opponent

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

battles = []
CSV.foreach(ARGV[0]) do |row|
  date = Time.at(row[11].to_i/1000).to_datetime
  battle = {
    date: {
      year: date.year,
      month: date.month,
      day: date.day
    },
    my_army: {
      caster: if army.key?(row[1].to_i) then army[row[1].to_i][:caster][:id] else row[1].to_i end,
      faction: if army.key?(row[1].to_i) then army[row[1].to_i][:faction][:id] else row[1].to_i end
    },
    opponent: {
      name: if opponent.key?(row[5].to_i) then opponent[row[5].to_i] else row[5].to_i end,
      caster: if army.key?(row[6].to_i) then army[row[6].to_i][:caster][:id] else row[6].to_i end,
      faction: if army.key?(row[6].to_i) then army[row[6].to_i][:faction][:id] else row[6].to_i end
    },
    points: {
      my_army: {
        scenario: row[2].to_i,
        army: row[3].to_i
      },
      opponent: {
        scenario: row[7].to_i,
        army: row[8].to_i
      }
    },
    setup: {
      size: row[12].to_i,
      scenario: if scenario.key?(row[10].to_i) then scenario[row[10].to_i] else row[10].to_i end,
      event: if event.key?(row[14].to_i) then event[row[14].to_i] else row[14].to_i end
    },
    score: if score.key?(row[13].to_i) then score[row[13].to_i] else row[13].to_i end,
    comment: row[15],
    initiative: if initiative.key?(row[16].to_i) then initiative[row[16].to_i] else row[16].to_i end,
  }
  battles.push battle
end

p battles.to_json
