class QcDataEntry < ApplicationRecord
    extend AdditionalFinders
    include UserData

    DATATABLE_PREFIX = 'qc_data_entry'

    has_one :user, :as => :entity, :dependent => :destroy
    belongs_to :employee_company

    validates :employee_company, presence: true
end
