source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem 'jekyll-sitemap'
gem 'jekyll-feed'
gem 'jekyll-seo-tag'

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# wdm (Windows Directory Monitor)
# - 원래는 Windows에서 Jekyll 파일 변경 감지를 위해 사용되는 Gem
# - 하지만 Windows + Ruby 환경에서 설치 시 네이티브 확장 빌드 실패 문제가 자주 발생
# - 따라서 주석 처리하여 제외 (핫 리로드 기능만 사라질 뿐, 실행에는 영향 없음)
# gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# http_parser.rb
# - Ruby용 HTTP 요청 파서
# - Jekyll 서버 실행 시 요청 파싱 안정성을 보완
# - wdm의 기능을 대체하는 건 아님 (파일 변경 감지와 무관)
# - Windows 환경에서 bundle install 실패 방지 및 서버 실행 안정화 목적
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]