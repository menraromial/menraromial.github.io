# Fix ActiveSupport `to_time` timezone deprecation warning (Rails 8.1+)
require 'active_support'
ActiveSupport.to_time_preserves_timezone = :zone
