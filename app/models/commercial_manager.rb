class CommercialManager < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'commercial_manager'

    has_one :user, :as => :entity, :dependent => :destroy
    belongs_to :employee_company
end
