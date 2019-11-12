class OperationsSupervisor < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'operations_supervisor'

    has_one :user, :as => :entity, :dependent => :destroy
    belongs_to :employee_company
end
