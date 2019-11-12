class CtManager < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'ct_manager'

    has_one :user, :as => :entity, :dependent => :destroy
end
