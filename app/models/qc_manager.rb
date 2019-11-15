class QcManager < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'qc_manager'

    has_one :user, :as => :entity, :dependent => :destroy
    belongs_to :employee_company
end
