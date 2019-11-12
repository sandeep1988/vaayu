class MdmAdmin < ApplicationRecord
	extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'mdm_admin'

    has_one :user, :as => :entity, :dependent => :destroy
end
