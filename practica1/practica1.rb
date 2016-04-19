require 'open-uri'
require 'json'

class Practica1


  @@url = ''
  @@user = ''

  def initialize ()
    puts "Please write a user to cloning a github repository"
    @@user = gets.chomp
    @@url = "https://api.github.com/users/#{@@user}"
  end

  def callGithubApi ()

    begin
      getResponseProfile = open(@@url)
      profileJson = JSON.parse(getResponseProfile.read)
      getRepos(profileJson["repos_url"])
    rescue OpenURI::HTTPError => error
      response = error.io
      at_exit do
        puts "Error in request. status #{response.status[0]} :: message #{response.status[1]}. No existing user."
      end
    end
  end

  def getRepos (url)
    begin
      getResponseRepos = open(url)
      reposJson = JSON.parse(getResponseRepos.read)
      puts "Github repositories availables with user #{@@user}. Select a number"
      $i = 1
      reposJson.each do |repo|
        puts "#{$i} #{repo["name"]}"
        $i += 1
      end
      ARGV.clear
      repo = gets.chomp
      repo = Integer(repo)
      cloningRepo(reposJson[repo - 1])
    rescue OpenURI::HTTPError => error
      response = error.io
      at_exit do
        puts "Error in request (Getting repos). status #{response.status[0]} :: message #{response.status[1]}"
      end
    end
  end

  def cloningRepo (repoHash)
    $folder = false
    Dir.entries('./').select { |entry|
      folder = (entry == repoHash["name"]) ? false : $folder = true
    }
    if $folder
      exec("git clone #{repoHash['clone_url']} #{repoHash['name']}")
    else
      at_exit do
        puts "Error cloning github repository. Folder destination exist"
      end
    end
  end


  private :getRepos, :cloningRepo
end

gitHubApi = Practica1.new()
gitHubApi.callGithubApi()