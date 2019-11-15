class OperationsAdmin < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'operations_admin'

    has_one :user, :as => :entity, :dependent => :destroy
end
