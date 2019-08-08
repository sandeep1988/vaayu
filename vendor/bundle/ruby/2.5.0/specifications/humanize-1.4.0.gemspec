# -*- encoding: utf-8 -*-
# stub: humanize 1.4.0 ruby lib

Gem::Specification.new do |s|
  s.name = "humanize".freeze
  s.version = "1.4.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jack Chen".freeze, "Ryan Bigg".freeze]
  s.date = "2016-03-30"
  s.email = "radarlistener@gmail.com".freeze
  s.homepage = "https://github.com/radar/humanize".freeze
  s.rubygems_version = "2.7.6".freeze
  s.summary = "Extension to Numeric to humanize numbers".freeze

  s.installed_by_version = "2.7.6" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>.freeze, [">= 0"])
      s.add_development_dependency(%q<mutant>.freeze, [">= 0"])
      s.add_development_dependency(%q<mutant-rspec>.freeze, [">= 0"])
      s.add_development_dependency(%q<pry-byebug>.freeze, [">= 0"])
    else
      s.add_dependency(%q<rspec>.freeze, [">= 0"])
      s.add_dependency(%q<mutant>.freeze, [">= 0"])
      s.add_dependency(%q<mutant-rspec>.freeze, [">= 0"])
      s.add_dependency(%q<pry-byebug>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<rspec>.freeze, [">= 0"])
    s.add_dependency(%q<mutant>.freeze, [">= 0"])
    s.add_dependency(%q<mutant-rspec>.freeze, [">= 0"])
    s.add_dependency(%q<pry-byebug>.freeze, [">= 0"])
  end
end
