# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20191216154017) do

  create_table "Induction_logs_WIP", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "resource_id",                    null: false
    t.string   "resource_type",    limit: 7,     null: false, comment: "'Driver','Vehicle'"
    t.string   "induction_status", limit: 8,     null: false, comment: "'Inducted','Rejected'"
    t.string   "approved_items",                 null: false
    t.string   "rejected_items",                 null: false
    t.text     "comments",         limit: 65535, null: false
    t.datetime "created_at",                     null: false
    t.string   "created_by",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "updated_by",                     null: false
  end

  create_table "auditors", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "authentications", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "portal"
    t.text     "x_api_key",  limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "ba_invoices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "company_type"
    t.integer  "company_id"
    t.datetime "date"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer  "trips_count"
    t.decimal  "amount",       precision: 12, scale: 2
    t.string   "status"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.index ["company_type", "company_id"], name: "index_ba_invoices_on_company_type_and_company_id", using: :btree
  end

  create_table "ba_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ba_package_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "ba_vehicle_rate_id"
    t.string  "duration"
    t.decimal "package_duty_hours",          precision: 10, default: 0
    t.decimal "package_km",                  precision: 10, default: 0
    t.decimal "package_overage_per_km",      precision: 10, default: 0
    t.decimal "package_overage_per_time",    precision: 10, default: 0
    t.boolean "package_overage_time",                       default: false
    t.decimal "package_rate",                precision: 10, default: 0
    t.string  "package_mileage_calculation"
    t.index ["ba_vehicle_rate_id"], name: "index_ba_package_rates_on_ba_vehicle_rate_id", using: :btree
  end

  create_table "ba_services", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "business_associate_id"
    t.string  "service_type"
    t.string  "billing_model"
    t.boolean "vary_with_vehicle",     default: false
    t.integer "logistics_company_id"
    t.index ["business_associate_id"], name: "index_ba_services_on_business_associate_id", using: :btree
    t.index ["logistics_company_id"], name: "index_ba_services_on_logistics_company_id", using: :btree
  end

  create_table "ba_trip_invoices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "trip_id"
    t.integer "ba_invoice_id"
    t.decimal "trip_amount",        precision: 10, default: 0
    t.decimal "trip_penalty",       precision: 10, default: 0
    t.decimal "trip_toll",          precision: 10, default: 0
    t.integer "ba_vehicle_rate_id"
    t.integer "ba_zone_rate_id"
    t.integer "vehicle_id"
    t.integer "ba_package_rate_id"
    t.index ["ba_invoice_id"], name: "index_ba_trip_invoices_on_ba_invoice_id", using: :btree
    t.index ["ba_package_rate_id"], name: "index_ba_trip_invoices_on_ba_package_rate_id", using: :btree
    t.index ["ba_vehicle_rate_id"], name: "index_ba_trip_invoices_on_ba_vehicle_rate_id", using: :btree
    t.index ["ba_zone_rate_id"], name: "index_ba_trip_invoices_on_ba_zone_rate_id", using: :btree
    t.index ["trip_id"], name: "index_ba_trip_invoices_on_trip_id", using: :btree
    t.index ["vehicle_id"], name: "index_ba_trip_invoices_on_vehicle_id", using: :btree
  end

  create_table "ba_vehicle_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "ba_service_id"
    t.integer "vehicle_capacity"
    t.boolean "ac",                              default: true
    t.decimal "cgst",             precision: 10
    t.decimal "sgst",             precision: 10
    t.boolean "overage",                         default: false
    t.integer "time_on_duty"
    t.decimal "overage_per_hour", precision: 10
    t.index ["ba_service_id"], name: "index_ba_vehicle_rates_on_ba_service_id", using: :btree
  end

  create_table "ba_zone_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "ba_vehicle_rate_id"
    t.decimal "rate",               precision: 10
    t.decimal "guard_rate",         precision: 10
    t.string  "name"
    t.index ["ba_vehicle_rate_id"], name: "index_ba_zone_rates_on_ba_vehicle_rate_id", using: :btree
  end

  create_table "bgc_agency_master", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "bgc_agency_name",                                                null: false
    t.string   "status",          limit: 8,                                      null: false
    t.datetime "created_at",                default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at",                                                     null: false
    t.string   "created_by",                                                     null: false
    t.string   "updated_by",                                                     null: false
  end

  create_table "bus_trip_routes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.text    "stop_name",      limit: 65535
    t.text    "stop_address",   limit: 65535
    t.decimal "stop_latitude",                precision: 10, scale: 6
    t.decimal "stop_longitude",               precision: 10, scale: 6
    t.integer "stop_order"
    t.integer "bus_trip_id"
    t.text    "name",           limit: 65535
    t.index ["bus_trip_id"], name: "index_bus_trip_routes_on_bus_trip_id", using: :btree
  end

  create_table "bus_trips", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "status"
    t.string   "route_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "business_associates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "admin_f_name"
    t.string   "admin_m_name"
    t.string   "admin_l_name"
    t.string   "admin_email"
    t.string   "admin_phone"
    t.string   "legal_name"
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.datetime "created_at",                                                                         null: false
    t.datetime "updated_at",                                                                         null: false
    t.string   "name"
    t.decimal  "standard_price",                          precision: 10,           default: 0
    t.integer  "pay_period",                                                       default: 0
    t.integer  "time_on_duty_limit",                                               default: 0
    t.integer  "distance_limit",                                                   default: 0
    t.decimal  "rate_by_time",                            precision: 10,           default: 0
    t.decimal  "rate_by_distance",                        precision: 10,           default: 0
    t.integer  "invoice_frequency",                                                default: 0
    t.decimal  "service_tax_percent",                     precision: 5,  scale: 4, default: "0.0"
    t.decimal  "swachh_bharat_cess",                      precision: 5,  scale: 4, default: "0.002"
    t.decimal  "krishi_kalyan_cess",                      precision: 5,  scale: 4, default: "0.002"
    t.integer  "logistics_company_id"
    t.string   "profit_centre"
    t.datetime "agreement_date"
    t.string   "category",                  limit: 10
    t.string   "sap_code"
    t.string   "esic_code"
    t.string   "pf_number"
    t.string   "aadhar_number"
    t.integer  "credit_days"
    t.integer  "credit_amount"
    t.datetime "bgc_date"
    t.datetime "credit_days_start"
    t.integer  "owned_fleet"
    t.integer  "managed_fleet"
    t.integer  "turn_over"
    t.string   "partnership_status"
    t.integer  "business_area_id"
    t.string   "address"
    t.string   "address_2"
    t.string   "alternate_phone"
    t.string   "fax_no"
    t.string   "website"
    t.text     "address_3",                 limit: 65535
    t.string   "bank_name"
    t.string   "bank_no"
    t.string   "ifsc_code"
    t.string   "city_of_operation"
    t.string   "state_of_operation"
    t.string   "msmed_certificate_doc_url"
    t.string   "photo_url"
    t.string   "owner_photo_url"
    t.string   "created_by"
    t.string   "updated_by"
    t.string   "ba_portal_id"
    t.string   "baId"
    t.string   "pin_code"
    t.string   "company_name"
    t.string   "contact_person"
    t.string   "cin_no"
    t.string   "landline"
    t.string   "contact_person_mobile"
    t.datetime "approved_till_date"
    t.string   "old_sap_master_code"
    t.string   "new_sap_master_code"
    t.datetime "ba_verified_on"
    t.string   "state_code"
    t.boolean  "is_gst",                                                           default: false
    t.text     "cancelled_cheque_doc_url",  limit: 65535
    t.text     "pan_card_doc_url",          limit: 65535
    t.text     "gstDocs",                   limit: 65535
    t.text     "bussiness_area",            limit: 65535
    t.text     "gst_certificates_doc_url",  limit: 65535
    t.index ["logistics_company_id"], name: "index_business_associates_on_logistics_company_id", using: :btree
  end

  create_table "checklist_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "checklist_id"
    t.string   "key"
    t.boolean  "value"
    t.integer  "compliance_type"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "priority",        default: false
    t.datetime "tat"
    t.datetime "created_by"
    t.datetime "updated_by"
    t.boolean  "status",          default: true
  end

  create_table "checklists", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "vehicle_id"
    t.integer  "driver_id"
    t.integer  "status",     default: 0
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "cities", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string "city_name", null: false
  end

  create_table "cluster_vehicles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "date"
    t.integer  "vehicle_id"
    t.integer  "employee_cluster_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["employee_cluster_id"], name: "index_cluster_vehicles_on_employee_cluster_id", using: :btree
    t.index ["vehicle_id"], name: "index_cluster_vehicles_on_vehicle_id", using: :btree
  end

  create_table "commercial_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "compliance_checks", unsigned: true, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "resource_id",                     null: false
    t.string   "resource_type",     limit: 7,     null: false
    t.string   "compliance_type",   limit: 16,    null: false
    t.integer  "site_id"
    t.text     "comments",          limit: 65535
    t.datetime "created_at",                      null: false
    t.datetime "updated_at"
    t.integer  "updated_by"
    t.integer  "created_by"
    t.string   "compliance_status", limit: 20,    null: false
    t.integer  "checklist_id",                    null: false
    t.datetime "tat_date"
  end

  create_table "compliance_notifications", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "driver_id"
    t.integer  "vehicle_id"
    t.string   "message"
    t.integer  "status",          default: 0
    t.integer  "compliance_type"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "compliances", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "key"
    t.integer  "modal_type"
    t.integer  "compliance_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "configurators", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string  "request_type"
    t.string  "value",                      default: "0"
    t.integer "conf_type",                  default: 0
    t.string  "display_name"
    t.text    "options",      limit: 65535
  end

  create_table "constraints", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "site_id",                                                     null: false
    t.string   "type",       limit: 20,                                       null: false
    t.string   "for",        limit: 10
    t.string   "event",      limit: 20
    t.string   "when",       limit: 20
    t.time     "from_time"
    t.time     "to_time"
    t.string   "clause",     limit: 50
    t.string   "operator",   limit: 50
    t.integer  "value"
    t.datetime "created_at",             default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string   "created_by", limit: 100
    t.datetime "updated_at"
    t.string   "updated_by", limit: 100
    t.index ["site_id"], name: "idx_constraints_site_id", using: :btree
  end

  create_table "contracts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "customer_id"
    t.integer  "site_id"
    t.string   "billing_cycle",                   null: false
    t.string   "unique_identifier",               null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at"
    t.string   "created_by"
    t.string   "updated_by"
    t.string   "customer_type",     limit: 8,     null: false
    t.text     "file_url",          limit: 65535
  end

  create_table "ct_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "devices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "device_id"
    t.string   "make"
    t.string   "model"
    t.string   "os"
    t.string   "os_version"
    t.integer  "status"
    t.integer  "driver_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "index_devices_on_driver_id", using: :btree
  end

  create_table "document_master", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string  "resource_type",     limit: 7, null: false
    t.string  "doc_name",                    null: false
    t.string  "doc_display_name",            null: false
    t.string  "doc_type",          limit: 8, null: false
    t.boolean "is_expiring",                 null: false
    t.string  "status",            limit: 8, null: false
    t.integer "notification_days", limit: 1
    t.date    "created_at",                  null: false
    t.date    "updated_at",                  null: false
    t.string  "created_by"
    t.string  "updated_by"
  end

  create_table "document_renewal_requests", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "resource_id",                 null: false
    t.string   "resource_type", limit: 7,     null: false
    t.integer  "document_id",   limit: 1,     null: false
    t.text     "document_url",  limit: 65535, null: false
    t.date     "expiry_date"
    t.string   "status",        limit: 8,     null: false
    t.integer  "created_by",                  null: false
    t.datetime "created_at",                  null: false
    t.integer  "updated_by"
    t.datetime "updated_at"
  end

  create_table "driver_first_pickups", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "trip_id"
    t.integer  "driver_id"
    t.integer  "pickup_time"
    t.datetime "time"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["driver_id"], name: "index_driver_first_pickups_on_driver_id", using: :btree
    t.index ["trip_id"], name: "index_driver_first_pickups_on_trip_id", using: :btree
  end

  create_table "driver_requests", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "request_type"
    t.integer  "reason"
    t.integer  "trip_type"
    t.string   "request_state"
    t.datetime "request_date"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer  "driver_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "vehicle_id"
    t.index ["driver_id"], name: "index_driver_requests_on_driver_id", using: :btree
    t.index ["vehicle_id"], name: "index_driver_requests_on_vehicle_id", using: :btree
  end

  create_table "drivers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "business_associate_id"
    t.string   "business_state"
    t.string   "business_city"
    t.string   "qualification"
    t.datetime "date_of_registration"
    t.date     "police_verification_vailidty"
    t.date     "date_of_police_verification"
    t.integer  "criminal_offence",                              limit: 1
    t.string   "criminal_offence_details"
    t.date     "bgc_date"
    t.integer  "bgc_agency_id"
    t.date     "medically_certified_date"
    t.string   "sexual_policy",                                 limit: 10,                    null: false
    t.string   "bank_name"
    t.string   "bank_no"
    t.string   "ifsc_code"
    t.integer  "logistics_company_id"
    t.integer  "site_id"
    t.string   "status"
    t.string   "badge_number"
    t.date     "badge_issue_date"
    t.date     "badge_expire_date"
    t.string   "local_address"
    t.string   "permanent_address"
    t.integer  "total_experience"
    t.string   "aadhaar_number"
    t.string   "aadhaar_mobile_number"
    t.string   "alternate_number"
    t.string   "blood_group",                                   limit: 4,                     null: false, comment: "'A+','A-','B+','B-','O+','O-','AB+','AB-'"
    t.string   "licence_type",                                  limit: 8,                     null: false, comment: "'MGV', 'LMV', 'HMV','HGMV','HPMV/HTV','Trailer'"
    t.string   "licence_number"
    t.date     "licence_validity"
    t.string   "verified_by_police"
    t.boolean  "uniform"
    t.boolean  "licence"
    t.boolean  "badge"
    t.datetime "created_at",                                                                  null: false
    t.datetime "updated_at",                                                                  null: false
    t.string   "aadhaar_address"
    t.string   "offline_phone"
    t.integer  "sort_status",                                                 default: -1
    t.integer  "active_checklist_id"
    t.text     "compliance_notification_message",               limit: 65535
    t.text     "compliance_notification_type",                  limit: 65535
    t.boolean  "verified_image",                                              default: false
    t.string   "driver_image_url"
    t.text     "comment",                                       limit: 65535
    t.string   "compliance_status",                             limit: 20
    t.boolean  "blacklisted",                                                 default: false
    t.text     "driving_license_doc_url",                       limit: 65535
    t.text     "driver_badge_doc_url",                          limit: 65535
    t.text     "id_proof_doc_url",                              limit: 65535
    t.text     "sexual_policy_doc_url",                         limit: 65535
    t.text     "police_verification_vailidty_doc_url",          limit: 65535
    t.text     "medically_certified_doc_url",                   limit: 65535
    t.text     "bgc_doc_url",                                   limit: 65535
    t.text     "profile_picture_url",                           limit: 65535
    t.text     "other_docs_url",                                limit: 65535
    t.text     "driving_registration_form_doc_url",             limit: 65535
    t.string   "created_by"
    t.string   "updated_by"
    t.string   "induction_status",                              limit: 10
    t.string   "renewal_status",                                limit: 16,                    null: false
    t.string   "driver_name"
    t.date     "date_of_birth"
    t.string   "marital_status",                                limit: 8,                     null: false, comment: "'Married', 'Single', 'Widowed', 'Divorced', 'N/A'"
    t.string   "father_spouse_name"
    t.string   "registration_steps"
    t.string   "gender"
    t.string   "driving_license_doc_file_name"
    t.string   "driving_license_doc_content_type"
    t.bigint   "driving_license_doc_file_size"
    t.datetime "driving_license_doc_updated_at"
    t.string   "driver_badge_doc_file_name"
    t.string   "driver_badge_doc_content_type"
    t.bigint   "driver_badge_doc_file_size"
    t.datetime "driver_badge_doc_updated_at"
    t.string   "id_proof_doc_file_name"
    t.string   "id_proof_doc_content_type"
    t.bigint   "id_proof_doc_file_size"
    t.datetime "id_proof_doc_updated_at"
    t.string   "driving_registration_form_doc_file_name"
    t.string   "driving_registration_form_doc_content_type"
    t.bigint   "driving_registration_form_doc_file_size"
    t.datetime "driving_registration_form_doc_updated_at"
    t.string   "f_name"
    t.string   "l_name"
    t.string   "profile_picture_file_name"
    t.string   "profile_picture_content_type"
    t.integer  "profile_picture_file_size"
    t.datetime "profile_picture_updated_at"
    t.date     "badge_expiry_date"
    t.string   "sap_code"
    t.string   "esic_code"
    t.string   "pf_number"
    t.string   "aadhar_number"
    t.integer  "credit_days"
    t.integer  "credit_amount"
    t.string   "police_verification_vailidty_doc_file_name"
    t.string   "police_verification_vailidty_doc_content_type"
    t.integer  "police_verification_vailidty_doc_file_size"
    t.datetime "police_verification_vailidty_doc_updated_at"
    t.string   "sexual_policy_doc_file_name"
    t.string   "sexual_policy_doc_content_type"
    t.integer  "sexual_policy_doc_file_size"
    t.datetime "sexual_policy_doc_updated_at"
    t.string   "medically_certified_doc_file_name"
    t.string   "medically_certified_doc_content_type"
    t.integer  "medically_certified_doc_file_size"
    t.datetime "medically_certified_doc_updated_at"
    t.string   "bgc_doc_file_name"
    t.string   "bgc_doc_content_type"
    t.integer  "bgc_doc_file_size"
    t.datetime "bgc_doc_updated_at"
    t.string   "shift_start_time"
    t.string   "shift_end_time"
    t.boolean  "submitted_by_qc",                                             default: false
    t.boolean  "active",                                                      default: true
    t.string   "other_doc_file_name"
    t.string   "other_doc_content_type"
    t.integer  "other_doc_file_size"
    t.datetime "other_doc_updated_at"
    t.date     "training_date"
    t.index ["business_associate_id"], name: "index_drivers_on_business_associate_id", using: :btree
    t.index ["logistics_company_id"], name: "index_drivers_on_logistics_company_id", using: :btree
    t.index ["site_id"], name: "index_drivers_on_site_id", using: :btree
  end

  create_table "drivers_shifts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "driver_id"
    t.integer  "vehicle_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer  "duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "index_drivers_shifts_on_driver_id", using: :btree
    t.index ["vehicle_id"], name: "index_drivers_shifts_on_vehicle_id", using: :btree
  end

  create_table "employee_clusters", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "error"
    t.datetime "date"
    t.integer  "driver_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "index_employee_clusters_on_driver_id", using: :btree
  end

  create_table "employee_companies", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "logistics_company_id"
    t.string   "name"
    t.datetime "created_at",                                                            null: false
    t.datetime "updated_at",                                                            null: false
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.decimal  "standard_price",             precision: 10,           default: 0
    t.integer  "pay_period",                                          default: 0
    t.integer  "time_on_duty_limit",                                  default: 0
    t.integer  "distance_limit",                                      default: 0
    t.decimal  "rate_by_time",               precision: 10,           default: 0
    t.decimal  "rate_by_distance",           precision: 10,           default: 0
    t.integer  "invoice_frequency",                                   default: 0
    t.decimal  "service_tax_percent",        precision: 5,  scale: 4, default: "0.0"
    t.decimal  "swachh_bharat_cess",         precision: 5,  scale: 4, default: "0.002"
    t.decimal  "krishi_kalyan_cess",         precision: 5,  scale: 4, default: "0.002"
    t.string   "profit_centre"
    t.datetime "agreement_date"
    t.string   "customer_code"
    t.string   "reference_no1"
    t.string   "reference_no2"
    t.boolean  "active",                                              default: true
    t.string   "zone"
    t.string   "category"
    t.string   "billing_to"
    t.string   "home_address_contact_name"
    t.string   "home_address_address_1"
    t.string   "home_address_address_2"
    t.string   "home_address_address_3"
    t.string   "home_address_pin"
    t.string   "home_address_state"
    t.string   "home_address_city"
    t.string   "home_address_phone_1"
    t.string   "home_address_phone_2"
    t.string   "home_address_business_area"
    t.string   "home_address_pan_no"
    t.string   "home_address_gstin_no"
    t.string   "registered_contact_name"
    t.string   "registered_address1"
    t.string   "registered_address2"
    t.string   "registered_address3"
    t.string   "registered_pin"
    t.string   "registered_state"
    t.string   "registered_city"
    t.string   "registered_phone1"
    t.string   "registered_phone2"
    t.string   "registered_business_area"
    t.string   "registered_pan_no"
    t.string   "registered_gstin_no"
    t.string   "sap_control_number"
    t.string   "contact_email"
    t.index ["logistics_company_id"], name: "index_employee_companies_on_logistics_company_id", using: :btree
  end

  create_table "employee_schedules", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "employee_id"
    t.integer  "day"
    t.time     "check_in"
    t.time     "check_out"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.datetime "date"
    t.index ["employee_id"], name: "index_employee_schedules_on_employee_id", using: :btree
  end

  create_table "employee_shifts_cutoff", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string "working_day", limit: 7
    t.string "shift_type",  limit: 7
    t.string "cutoff_time", limit: 45
    t.string "status",      limit: 45, default: "active"
    t.string "created_at",  limit: 45
    t.string "site_id",     limit: 45
  end

  create_table "employee_trip_issues", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "issue"
    t.integer "employee_trip_id"
    t.index ["employee_trip_id"], name: "index_employee_trip_issues_on_employee_trip_id", using: :btree
  end

  create_table "employee_trips", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "employee_id"
    t.integer  "trip_id"
    t.datetime "date"
    t.integer  "trip_type",                                                                 comment: "0 for CheckIn and 1 for CheckOut"
    t.string   "status"
    t.integer  "employee_schedule_id"
    t.datetime "created_at",                                                   null: false
    t.datetime "updated_at",                                                   null: false
    t.integer  "trip_route_id"
    t.integer  "rating"
    t.text     "rating_feedback",                limit: 65535
    t.boolean  "dismissed",                                    default: false
    t.integer  "site_id"
    t.integer  "state"
    t.datetime "schedule_date"
    t.integer  "zone"
    t.text     "cluster_error",                  limit: 65535
    t.boolean  "bus_rider",                                    default: false
    t.integer  "shift_id"
    t.boolean  "is_clustered",                                 default: false
    t.text     "route_order",                    limit: 65535
    t.integer  "employee_cluster_id"
    t.text     "cancel_status",                  limit: 65535
    t.string   "exception_status"
    t.boolean  "is_rating_screen_shown",                       default: false
    t.boolean  "is_still_on_board_screen_shown",               default: false
    t.boolean  "is_leave",                                     default: false
    t.index ["employee_cluster_id"], name: "index_employee_trips_on_employee_cluster_id", using: :btree
    t.index ["employee_id"], name: "index_employee_trips_on_employee_id", using: :btree
    t.index ["trip_id"], name: "index_employee_trips_on_trip_id", using: :btree
    t.index ["trip_route_id"], name: "index_employee_trips_on_trip_route_id", using: :btree
  end

  create_table "employees", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "employee_company_id"
    t.integer  "site_id"
    t.integer  "zone_id"
    t.string   "employee_id"
    t.integer  "gender"
    t.string   "home_address"
    t.decimal  "home_address_latitude",                 precision: 10, scale: 6
    t.decimal  "home_address_longitude",                precision: 10, scale: 6
    t.integer  "distance_to_site"
    t.date     "date_of_birth"
    t.string   "managers_employee_id"
    t.string   "managers_email_id"
    t.datetime "created_at",                                                                         null: false
    t.datetime "updated_at",                                                                         null: false
    t.string   "emergency_contact_name"
    t.string   "emergency_contact_phone"
    t.integer  "line_manager_id"
    t.boolean  "is_guard",                                                       default: false
    t.text     "geohash",                 limit: 65535
    t.boolean  "bus_travel",                                                     default: false
    t.integer  "bus_trip_route_id"
    t.string   "billing_zone",                                                   default: "Default"
    t.string   "landmark"
    t.string   "nodal_address"
    t.decimal  "nodal_address_latitude",                precision: 10, scale: 6
    t.decimal  "nodal_address_longitude",               precision: 10, scale: 6
    t.string   "nodal_name"
    t.string   "special",                 limit: 3,                                                  null: false
    t.index ["bus_trip_route_id"], name: "index_employees_on_bus_trip_route_id", using: :btree
    t.index ["employee_company_id"], name: "index_employees_on_employee_company_id", using: :btree
    t.index ["site_id"], name: "index_employees_on_site_id", using: :btree
    t.index ["zone_id"], name: "index_employees_on_zone_id", using: :btree
  end

  create_table "employer_shift_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "employee_company_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "employers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "employee_company_id"
    t.string   "legal_name"
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["employee_company_id"], name: "index_employers_on_employee_company_id", using: :btree
  end

  create_table "google_api_keys", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "key"
    t.string   "status"
    t.datetime "rate_limited_at"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.datetime "disabled_at"
  end

  create_table "google_api_keys_temp", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "id",              default: 0, null: false
    t.string   "key"
    t.string   "status"
    t.datetime "rate_limited_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.datetime "disabled_at"
  end

  create_table "google_api_keys_temp2", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "id",              default: 0, null: false
    t.string   "key"
    t.string   "status"
    t.datetime "rate_limited_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.datetime "disabled_at"
  end

  create_table "google_api_keys_temp_23april", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "id",              default: 0, null: false
    t.string   "key"
    t.string   "status"
    t.datetime "rate_limited_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.datetime "disabled_at"
  end

  create_table "google_maps_cache", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "key_str",   limit: 1000
    t.text     "value_str", limit: 4294967295
    t.string   "api_type"
    t.datetime "created"
    t.datetime "updated"
    t.index ["key_str", "api_type"], name: "key_str_type", length: { key_str: 191, api_type: 191 }, using: :btree
  end

  create_table "induction", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "resource_id",                                                         null: false
    t.string   "resource_type",    limit: 7,                                                       comment: "'Driver','Vehicle'"
    t.string   "induction_status", limit: 8,     default: "Draft",                    null: false, comment: "'Inducted','Rejected'"
    t.string   "approved_items",                                                      null: false
    t.string   "rejected_items",                                                      null: false
    t.text     "comments",         limit: 65535,                                      null: false
    t.datetime "created_at",                     default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string   "created_by",                                                          null: false
    t.datetime "updated_at",                                                          null: false
    t.string   "updated_by"
  end

  create_table "induction_check", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "induction_id",           null: false
    t.integer  "itemid",                 null: false
    t.integer  "resource_id"
    t.string   "status",       limit: 8, null: false
    t.datetime "created_at"
    t.string   "created_by"
    t.datetime "updated_at"
    t.string   "updated_by"
  end

  create_table "ingest_jobs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.date     "start_date"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.string   "status"
    t.integer  "user_id"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "error_file_file_name"
    t.string   "error_file_content_type"
    t.integer  "error_file_file_size"
    t.datetime "error_file_updated_at"
    t.integer  "failed_row_count",           default: 0
    t.integer  "processed_row_count",        default: 0
    t.integer  "schedule_updated_count",     default: 0
    t.integer  "employee_provisioned_count", default: 0
    t.integer  "schedule_provisioned_count", default: 0
    t.integer  "schedule_assigned_count",    default: 0
    t.string   "ingest_type"
    t.string   "file_digest"
    t.index ["user_id"], name: "index_ingest_jobs_on_user_id", using: :btree
  end

  create_table "invoice_attachments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "invoice_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.index ["invoice_id"], name: "index_invoice_attachments_on_invoice_id", using: :btree
  end

  create_table "invoices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "company_type"
    t.integer  "company_id"
    t.datetime "date"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer  "trips_count"
    t.decimal  "amount",       precision: 12, scale: 2
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "status"
    t.index ["company_type", "company_id"], name: "index_invoices_on_company_type_and_company_id", using: :btree
  end

  create_table "line_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "employee_company_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["employee_company_id"], name: "index_line_managers_on_employee_company_id", using: :btree
  end

  create_table "logistics_companies", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.text     "phone",          limit: 65535
  end

  create_table "master_checklists", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string  "checklist_name"
    t.string  "type"
    t.boolean "status",         default: true, null: false
    t.index ["id"], name: "id_UNIQUE", unique: true, using: :btree
  end

  create_table "mdm_admins", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "logistics_company_id"
  end

  create_table "mll_audit_users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "mll_compliance_users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "modules", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string "ModuleName",                    null: false
    t.text   "EncryptedString", limit: 65535
  end

  create_table "notifications", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "driver_id"
    t.integer  "employee_id"
    t.integer  "trip_id"
    t.string   "message"
    t.integer  "receiver"
    t.integer  "status"
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.boolean  "resolved_status",                 default: true
    t.text     "call_sid",          limit: 65535
    t.boolean  "new_notification",                default: false
    t.integer  "sequence"
    t.string   "reporter"
    t.string   "remarks"
    t.integer  "employee_trip_id"
    t.integer  "driver_request_id"
    t.index ["driver_id"], name: "index_notifications_on_driver_id", using: :btree
    t.index ["driver_request_id"], name: "index_notifications_on_driver_request_id", using: :btree
    t.index ["employee_id"], name: "index_notifications_on_employee_id", using: :btree
    t.index ["employee_trip_id"], name: "index_notifications_on_employee_trip_id", using: :btree
    t.index ["trip_id"], name: "index_notifications_on_trip_id", using: :btree
  end

  create_table "operations_admins", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "operations_supervisors", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "operator_shift_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "logistics_company_id"
    t.string   "legal_name"
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "operators", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "logistics_company_id"
    t.string   "legal_name"
    t.string   "pan"
    t.string   "tan"
    t.string   "business_type"
    t.string   "service_tax_no"
    t.string   "hq_address"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["logistics_company_id"], name: "index_operators_on_logistics_company_id", using: :btree
  end

  create_table "package_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "vehicle_rate_id"
    t.string  "duration"
    t.decimal "package_duty_hours",          precision: 10, default: 0
    t.decimal "package_km",                  precision: 10, default: 0
    t.decimal "package_overage_per_km",      precision: 10, default: 0
    t.decimal "package_overage_per_time",    precision: 10, default: 0
    t.boolean "package_overage_time",                       default: false
    t.decimal "package_rate",                precision: 10, default: 0
    t.string  "package_mileage_calculation"
    t.index ["vehicle_rate_id"], name: "index_package_rates_on_vehicle_rate_id", using: :btree
  end

  create_table "qc_data_entries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
  end

  create_table "qc_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rate_contracts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "contract_id",                                             null: false
    t.integer  "site_id"
    t.string   "trip_category"
    t.string   "subcontract_model"
    t.string   "vehicle_category"
    t.string   "vehicle_model"
    t.integer  "age_of_vehicle"
    t.string   "distance_consolidation"
    t.integer  "trip_time"
    t.integer  "operational_hours"
    t.time     "from_time"
    t.time     "to_time"
    t.integer  "working_days"
    t.string   "unit_of_measure"
    t.integer  "daily_km_start"
    t.integer  "daily_km_end"
    t.integer  "monthly_km_start"
    t.integer  "monthly_km_end"
    t.integer  "fixed_rate"
    t.integer  "guard_rate"
    t.integer  "rate_per_km"
    t.integer  "rate_per_extra_km"
    t.integer  "rate_per_extra_hour"
    t.integer  "night_charges"
    t.integer  "bata_per_day_charges"
    t.datetime "valid_from"
    t.datetime "valid_to"
    t.boolean  "bucket"
    t.integer  "allowed_bucketed_vehicles"
    t.string   "AC"
    t.integer  "shift"
    t.string   "zone"
    t.string   "trip_type"
    t.integer  "garage_km"
    t.integer  "Garage_rate"
    t.integer  "swing_km"
    t.string   "km_selection_options"
    t.boolean  "pro_rata"
    t.string   "day_type"
    t.integer  "rate_per_boarded_emplpyee"
    t.integer  "min_billable_count_employee_escort"
    t.integer  "no_show_count_percentage"
    t.integer  "min_billable_count_per_month_employee_escort"
    t.string   "min_billable_count_frequency"
    t.integer  "fte_count_from"
    t.integer  "fte_count_to"
    t.integer  "rate_per_fte"
    t.integer  "escort_multiplication_factor"
    t.integer  "discounted_count_for_escort"
    t.integer  "occupancy"
    t.integer  "vehicle_age_per_unit"
    t.datetime "created_at",                                              null: false
    t.string   "created_by",                                              null: false
    t.datetime "updated_at"
    t.string   "updated_by"
    t.string   "guard",                                        limit: 45
  end

  create_table "roaster_shift", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "shift_id"
    t.text     "vehicle_availability",   limit: 65535
    t.integer  "seating_capacity"
    t.datetime "created_at"
    t.string   "created_by"
    t.datetime "updated_at"
    t.string   "updated_by"
    t.date     "scheduled_date"
    t.integer  "total_vehicles"
    t.integer  "no_of_emp"
    t.text     "vehicle_capacity",       limit: 65535
    t.boolean  "trip_type"
    t.string   "isConstraintsSatisfied", limit: 3,     default: "yes", null: false
  end

  create_table "role_permissions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "role_id",   null: false
    t.integer "module_id", null: false
    t.boolean "p_create"
    t.boolean "p_read"
    t.boolean "p_update"
    t.boolean "p_delete"
  end

  create_table "roles", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "role_case",            null: false
    t.string  "role_name", limit: 45, null: false
    t.index ["role_case"], name: "role_case_UNIQUE", unique: true, using: :btree
    t.index ["role_name"], name: "role_name_UNIQUE", unique: true, using: :btree
  end

  create_table "services", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "site_id"
    t.string  "service_type"
    t.string  "billing_model"
    t.boolean "vary_with_vehicle",    default: false
    t.integer "logistics_company_id"
    t.index ["logistics_company_id"], name: "index_services_on_logistics_company_id", using: :btree
    t.index ["site_id"], name: "index_services_on_site_id", using: :btree
  end

  create_table "shift_times", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "shift_manager_id"
    t.integer  "site_id"
    t.integer  "shift_type"
    t.datetime "date"
    t.datetime "schedule_date"
    t.string   "type"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "shift_users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "shift_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "name"
    t.string   "start_time"
    t.string   "end_time"
    t.string   "status"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.integer  "site_id"
    t.string   "name_2"
    t.string   "name_3",                     limit: 15
    t.integer  "adhoc_shift",                           default: 0, null: false
    t.string   "working_day"
    t.date     "adhoc_shift_generated_date"
  end

  create_table "sites", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.decimal  "latitude",                          precision: 10, scale: 6
    t.decimal  "longitude",                         precision: 10, scale: 6
    t.integer  "employee_company_id"
    t.datetime "created_at",                                                                null: false
    t.datetime "updated_at",                                                                null: false
    t.string   "address"
    t.text     "phone",               limit: 65535
    t.string   "created_by"
    t.string   "updated_by"
    t.string   "admin_name"
    t.string   "admin_email_id"
    t.string   "branch_name"
    t.string   "site_code"
    t.string   "contact_name"
    t.text     "address_1",           limit: 65535
    t.text     "address_2",           limit: 65535
    t.text     "address_3",           limit: 65535
    t.string   "pin"
    t.string   "state"
    t.string   "city"
    t.string   "phone_1"
    t.string   "phone_2"
    t.string   "business_area"
    t.string   "pan_no"
    t.string   "gstin_no"
    t.string   "cost_centre"
    t.string   "profit_centre"
    t.string   "gl_acc_no"
    t.string   "party_code"
    t.string   "party_contact_name"
    t.string   "party_address_1"
    t.string   "party_address_2"
    t.string   "party_address_3"
    t.string   "party_pin"
    t.string   "party_city"
    t.string   "party_state"
    t.string   "party_phone_1"
    t.string   "party_phone_2"
    t.string   "party_business_area"
    t.string   "party_pan_no"
    t.string   "party_gstin_no"
    t.string   "contact_email"
    t.boolean  "active",                                                     default: true
    t.string   "sez"
    t.datetime "lut_date"
    t.string   "lut_no"
    t.string   "party_name"
    t.string   "proximity_radius"
    t.string   "sap_control_number"
    t.string   "address2"
    t.string   "contact_phone"
    t.index ["employee_company_id"], name: "index_sites_on_employee_company_id", using: :btree
  end

  create_table "states", unsigned: true, force: :cascade, options: "ENGINE=MyISAM DEFAULT CHARSET=latin1" do |t|
    t.string "state", limit: 50, null: false
  end

  create_table "status_checklistitems", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "compliance_id",                null: false
    t.integer  "itemid",                       null: false
    t.boolean  "status",        default: true, null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at"
    t.integer  "created_by"
    t.integer  "updated_by"
    t.index ["id"], name: "id_UNIQUE", unique: true, using: :btree
  end

  create_table "tats", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "resource_id",                  null: false
    t.string   "resource_type",     limit: 7,  null: false
    t.string   "compliance_status", limit: 20, null: false
    t.date     "expiry_date",                  null: false
    t.integer  "document_id",                  null: false
    t.datetime "created_at",                   null: false
    t.string   "created_by",                   null: false
    t.datetime "updated_at"
    t.string   "updated_by"
  end

  create_table "transport_desk_managers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "employee_company_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["employee_company_id"], name: "index_transport_desk_managers_on_employee_company_id", using: :btree
  end

  create_table "trip_change_requests", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "request_type"
    t.integer  "reason"
    t.integer  "trip_type"
    t.string   "request_state"
    t.datetime "new_date"
    t.integer  "employee_id"
    t.integer  "employee_trip_id"
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.boolean  "shift",                          default: false
    t.boolean  "bus_rider",                      default: false
    t.text     "schedule_date",    limit: 65535
    t.integer  "shift_id"
    t.index ["employee_id"], name: "index_trip_change_requests_on_employee_id", using: :btree
    t.index ["employee_trip_id"], name: "index_trip_change_requests_on_employee_trip_id", using: :btree
  end

  create_table "trip_invoices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "trip_id"
    t.integer "invoice_id"
    t.decimal "trip_amount",     precision: 10, default: 0
    t.decimal "trip_penalty",    precision: 10, default: 0
    t.decimal "trip_toll",       precision: 10, default: 0
    t.integer "vehicle_rate_id"
    t.integer "zone_rate_id"
    t.integer "vehicle_id"
    t.integer "package_rate_id"
    t.index ["invoice_id"], name: "index_trip_invoices_on_invoice_id", using: :btree
    t.index ["package_rate_id"], name: "index_trip_invoices_on_package_rate_id", using: :btree
    t.index ["trip_id"], name: "index_trip_invoices_on_trip_id", using: :btree
    t.index ["vehicle_id"], name: "index_trip_invoices_on_vehicle_id", using: :btree
    t.index ["vehicle_rate_id"], name: "index_trip_invoices_on_vehicle_rate_id", using: :btree
    t.index ["zone_rate_id"], name: "index_trip_invoices_on_zone_rate_id", using: :btree
  end

  create_table "trip_locations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "trip_id"
    t.text     "location",   limit: 65535
    t.datetime "time"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "distance"
    t.text     "speed",      limit: 65535
    t.index ["trip_id"], name: "index_trip_locations_on_trip_id", using: :btree
  end

  create_table "trip_route_exceptions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "trip_route_id"
    t.datetime "date"
    t.integer  "exception_type"
    t.string   "status"
    t.datetime "resolved_date"
    t.text     "message",        limit: 4294967295
  end

  create_table "trip_routes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "shift_id"
    t.integer  "site_id"
    t.integer  "customer_id"
    t.string   "shift_type",                                                     collation: "utf8_general_ci"
    t.integer  "planned_duration"
    t.integer  "planned_distance"
    t.integer  "planned_route_order"
    t.text     "planned_start_location",           limit: 65535,                 collation: "utf8_general_ci"
    t.text     "planned_end_location",             limit: 65535,                 collation: "utf8_general_ci"
    t.integer  "employee_trip_id"
    t.integer  "trip_id"
    t.datetime "driver_arrived_date"
    t.datetime "on_board_date"
    t.datetime "completed_date"
    t.string   "status",                                                         collation: "utf8_general_ci"
    t.string   "trip_start",                                                     collation: "utf8_general_ci"
    t.string   "trip_end",                                                       collation: "utf8_general_ci"
    t.integer  "total_seats"
    t.integer  "empty_seats"
    t.string   "guard_required",                   limit: 10,                    collation: "utf8_general_ci"
    t.string   "vehicle_allocated",                limit: 10,                    collation: "utf8_general_ci"
    t.integer  "scheduled_distance"
    t.integer  "scheduled_duration"
    t.integer  "scheduled_route_order"
    t.text     "scheduled_start_location",         limit: 65535,                 collation: "utf8_general_ci"
    t.text     "scheduled_end_location",           limit: 65535,                 collation: "utf8_general_ci"
    t.text     "driver_arrived_location",          limit: 65535,                 collation: "utf8_general_ci"
    t.text     "check_in_location",                limit: 65535,                 collation: "utf8_general_ci"
    t.text     "drop_off_location",                limit: 65535,                 collation: "utf8_general_ci"
    t.text     "missed_location",                  limit: 65535,                 collation: "utf8_general_ci"
    t.boolean  "cancel_exception",                               default: false
    t.text     "cab_type",                         limit: 65535,                 collation: "utf8_general_ci"
    t.integer  "cab_fare"
    t.text     "cab_driver_name",                  limit: 65535,                 collation: "utf8_general_ci"
    t.text     "cab_licence_number",               limit: 65535,                 collation: "utf8_general_ci"
    t.text     "cab_start_location",               limit: 65535,                 collation: "utf8_general_ci"
    t.text     "cab_end_location",                 limit: 65535,                 collation: "utf8_general_ci"
    t.boolean  "bus_rider",                                      default: false
    t.text     "bus_stop_name",                    limit: 65535,                 collation: "utf8_general_ci"
    t.text     "bus_stop_address",                 limit: 65535,                 collation: "utf8_general_ci"
    t.datetime "missed_date"
    t.datetime "geofence_driver_arrived_date"
    t.datetime "geofence_completed_date"
    t.text     "geofence_driver_arrived_location", limit: 65535,                 collation: "utf8_general_ci"
    t.text     "geofence_completed_location",      limit: 65535,                 collation: "utf8_general_ci"
    t.datetime "move_to_next_step_date"
    t.text     "move_to_next_step_location",       limit: 65535,                 collation: "utf8_general_ci"
    t.datetime "pick_up_time"
    t.datetime "drop_off_time"
    t.string   "exception_status",                                               collation: "utf8_general_ci"
  end

  create_table "trip_routes_clubbed", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "shift_id"
    t.integer  "site_id"
    t.integer  "customer_id"
    t.string   "shift_type"
    t.integer  "planned_duration"
    t.integer  "planned_distance"
    t.integer  "planned_route_order"
    t.text     "planned_start_location",           limit: 65535
    t.text     "planned_end_location",             limit: 65535
    t.integer  "employee_trip_id"
    t.integer  "trip_id"
    t.datetime "driver_arrived_date"
    t.datetime "on_board_date"
    t.datetime "completed_date"
    t.string   "status"
    t.string   "trip_start"
    t.string   "trip_end"
    t.integer  "total_seats"
    t.integer  "empty_seats"
    t.string   "guard_required",                   limit: 10
    t.string   "vehicle_allocated",                limit: 10
    t.integer  "scheduled_distance"
    t.integer  "scheduled_duration"
    t.integer  "scheduled_route_order"
    t.text     "scheduled_start_location",         limit: 65535
    t.text     "scheduled_end_location",           limit: 65535
    t.text     "driver_arrived_location",          limit: 65535
    t.text     "check_in_location",                limit: 65535
    t.text     "drop_off_location",                limit: 65535
    t.text     "missed_location",                  limit: 65535
    t.boolean  "cancel_exception",                               default: false
    t.text     "cab_type",                         limit: 65535
    t.integer  "cab_fare"
    t.text     "cab_driver_name",                  limit: 65535
    t.text     "cab_licence_number",               limit: 65535
    t.text     "cab_start_location",               limit: 65535
    t.text     "cab_end_location",                 limit: 65535
    t.boolean  "bus_rider",                                      default: false
    t.text     "bus_stop_name",                    limit: 65535
    t.text     "bus_stop_address",                 limit: 65535
    t.datetime "missed_date"
    t.datetime "geofence_driver_arrived_date"
    t.datetime "geofence_completed_date"
    t.text     "geofence_driver_arrived_location", limit: 65535
    t.text     "geofence_completed_location",      limit: 65535
    t.datetime "move_to_next_step_date"
    t.text     "move_to_next_step_location",       limit: 65535
    t.datetime "pick_up_time"
    t.datetime "drop_off_time"
    t.string   "exception_status"
    t.index ["employee_trip_id"], name: "index_trip_routes_on_employee_trip_id", using: :btree
  end

  create_table "trip_to_rate_mapping", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "trip_id",                                                               null: false
    t.integer  "rate_contract_id",                                                      null: false
    t.float    "trip_charges",       limit: 24,                                         null: false
    t.float    "additional_charges", limit: 24,    default: 0.0
    t.float    "gst_percentage",     limit: 24,    default: 0.0
    t.float    "total_charges",      limit: 24,                                         null: false
    t.text     "rate_contract_json", limit: 65535
    t.datetime "created_at",                       default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string   "created_by"
    t.datetime "updated_at"
    t.string   "updated_by"
    t.index ["trip_id"], name: "idx_trip_to_rate_mapping_trip_id", using: :btree
  end

  create_table "trips", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "driver_id"
    t.integer  "shift_id"
    t.string   "status"
    t.datetime "planned_date"
    t.datetime "created_at",                                                                           null: false
    t.datetime "updated_at",                                                                           null: false
    t.integer  "trip_type"
    t.integer  "planned_approximate_duration"
    t.datetime "start_date"
    t.datetime "assign_request_expired_date"
    t.integer  "planned_approximate_distance"
    t.integer  "vehicle_id"
    t.integer  "site_id"
    t.integer  "real_duration"
    t.datetime "completed_date"
    t.datetime "trip_accept_time"
    t.text     "start_location",                     limit: 65535
    t.integer  "scheduled_approximate_duration"
    t.integer  "scheduled_approximate_distance"
    t.datetime "scheduled_date"
    t.text     "cancel_status",                      limit: 65535
    t.boolean  "book_ola",                                                             default: false
    t.text     "ola_fare",                           limit: 65535
    t.boolean  "bus_rider",                                                            default: false
    t.decimal  "toll",                                                  precision: 10, default: 0
    t.decimal  "penalty",                                               precision: 10, default: 0
    t.decimal  "amount",                                                precision: 10, default: 0
    t.boolean  "paid",                                                                 default: false
    t.boolean  "is_manual",                                                            default: false
    t.integer  "employee_cluster_id"
    t.text     "trip_accept_location",               limit: 65535
    t.decimal  "ba_toll",                                               precision: 10, default: 0
    t.decimal  "ba_penalty",                                            precision: 10, default: 0
    t.decimal  "ba_amount",                                             precision: 10, default: 0
    t.boolean  "ba_paid",                                                              default: false
    t.integer  "actual_mileage",                                                       default: 0
    t.datetime "driver_should_start_trip_time"
    t.text     "driver_should_start_trip_location",  limit: 65535
    t.datetime "driver_should_start_trip_timestamp"
    t.datetime "trip_assign_date"
    t.datetime "shift_date"
    t.text     "search_index",                       limit: 65535
    t.boolean  "verified_driver_image",                                                default: false
    t.integer  "guard_id"
    t.string   "vehicle_type"
    t.string   "vehicle_model"
    t.string   "vehicle_number"
    t.string   "vehicle_allocated",                  limit: 10
    t.string   "trip_category"
    t.integer  "age_of_vehicle"
    t.string   "ac_nonac_trip"
    t.integer  "trip_zone"
    t.integer  "garage_km"
    t.integer  "swing_km"
    t.integer  "planned_employee_count"
    t.integer  "actual_travelled_employees"
    t.integer  "vehicle_capacity"
    t.string   "guard_required"
    t.boolean  "is_distance_exceeded"
    t.boolean  "is_time_exceeded"
    t.text     "routeresponse",                      limit: 65535
    t.string   "current_lat",                        limit: 45
    t.string   "current_lng",                        limit: 45
    t.text     "route_lat_lng_json",                 limit: 4294967295
    t.boolean  "panic_raised",                                                         default: false
    t.string   "panic_status",                       limit: 45
    t.string   "panic_remarks",                      limit: 200
    t.index ["driver_id"], name: "index_trips_on_driver_id", using: :btree
    t.index ["scheduled_date"], name: "index_trips_on_scheduled_date", using: :btree
    t.index ["site_id"], name: "index_trips_on_site_id", using: :btree
    t.index ["status"], name: "index_trips_on_status", using: :btree
    t.index ["vehicle_id"], name: "index_trips_on_vehicle_id", using: :btree
  end

  create_table "user_assets", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "user_id",    null: false
    t.integer "asset_id",   null: false
    t.string  "asset_type"
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "email",                                default: "",                    null: false
    t.string   "username"
    t.string   "f_name"
    t.string   "m_name"
    t.string   "l_name"
    t.integer  "role",                                 default: 0
    t.string   "entity_type"
    t.integer  "entity_id"
    t.string   "phone"
    t.string   "encrypted_password",                   default: "",                    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                        default: 0,                     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                                                           null: false
    t.datetime "updated_at",                                                           null: false
    t.text     "tokens",                 limit: 65535
    t.string   "provider",                             default: "email",               null: false
    t.string   "uid",                                  default: "",                    null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.datetime "last_active_time",                     default: '2009-01-01 00:00:00'
    t.integer  "status"
    t.string   "passcode"
    t.integer  "invite_count",                         default: 0
    t.text     "current_location",       limit: 65535
    t.string   "process_code"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["entity_type", "entity_id"], name: "index_users_on_entity_type_and_entity_id", using: :btree
    t.index ["phone"], name: "index_users_on_phone", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["uid"], name: "index_users_on_uid", using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
  end

  create_table "vehicle_categories", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "category_name"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "avg_speed"
    t.integer  "seating_capacity"
  end

  create_table "vehicle_models", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "make_model"
    t.integer  "vehicle_category_id"
    t.integer  "capacity"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "vehicle_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "service_id"
    t.integer "vehicle_capacity"
    t.boolean "ac",                              default: true
    t.decimal "cgst",             precision: 10, default: 0
    t.decimal "sgst",             precision: 10, default: 0
    t.boolean "overage",                         default: false
    t.decimal "time_on_duty",     precision: 10, default: 0
    t.decimal "overage_per_hour", precision: 10, default: 0
    t.index ["service_id"], name: "index_vehicle_rates_on_service_id", using: :btree
  end

  create_table "vehicle_trip_invoices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "trip_id"
    t.integer "trip_invoice_id"
    t.integer "vehicle_id"
    t.integer "ba_trip_invoice_id"
    t.index ["ba_trip_invoice_id"], name: "index_vehicle_trip_invoices_on_ba_trip_invoice_id", using: :btree
    t.index ["trip_id"], name: "index_vehicle_trip_invoices_on_trip_id", using: :btree
    t.index ["trip_invoice_id"], name: "index_vehicle_trip_invoices_on_trip_invoice_id", using: :btree
    t.index ["vehicle_id"], name: "index_vehicle_trip_invoices_on_vehicle_id", using: :btree
  end

  create_table "vehicles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "driver_id"
    t.string   "business_associate_id"
    t.string   "name"
    t.string   "plate_number"
    t.string   "make"
    t.string   "model"
    t.string   "colour"
    t.string   "driverid"
    t.string   "driver_name"
    t.string   "rc_book_no"
    t.datetime "registration_date"
    t.date     "insurance_date"
    t.string   "permit_type"
    t.date     "permit_validity_date"
    t.date     "puc_validity_date"
    t.date     "fc_validity_date"
    t.boolean  "ac"
    t.integer  "seats",                                                    default: 0
    t.string   "fuel_type"
    t.integer  "make_year",                                                                  null: false,                                                                                                                                unsigned: true
    t.integer  "odometer",                                                                                                                                                                                                               unsigned: true
    t.boolean  "spare_type"
    t.boolean  "first_aid_kit"
    t.string   "tyre_condition"
    t.string   "fuel_level"
    t.string   "plate_condition"
    t.string   "device_id",                                                                               collation: "utf8_bin"
    t.string   "category"
    t.string   "business_area_id"
    t.date     "fitness_validity_date"
    t.date     "road_tax_validity_date"
    t.date     "last_service_date"
    t.integer  "last_service_km",                                          default: 0
    t.integer  "km_at_induction",                                          default: 0
    t.date     "authorization_certificate_validity_date"
    t.datetime "date_of_registration"
    t.string   "gps_provider_id",                                                                                                comment: "1.ARYA OMNITALK)\n2.AUTOCOP\n3.FALCON AVL SYSTEM\n4.MAP MY INDIA\n5.MOVE IN SYNC\n6.NIVAATA"
    t.string   "insurance_doc_url"
    t.string   "rc_book_doc_url"
    t.string   "puc_doc_url"
    t.string   "commercial_permit_doc_url"
    t.string   "road_tax_doc_url"
    t.string   "fitness_doc_url"
    t.string   "vehicle_picture_url"
    t.string   "authorization_certificate_doc_url"
    t.string   "site_id"
    t.string   "created_by"
    t.string   "updated_by"
    t.string   "induction_status",                           limit: 10,    default: "Draft", null: false
    t.string   "renewal_status",                             limit: 16
    t.datetime "created_at",                                                                 null: false
    t.datetime "updated_at",                                                                 null: false
    t.text     "comment",                                    limit: 65535
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.text     "status",                                     limit: 65535
    t.date     "induction_date"
    t.integer  "sort_status",                                              default: -1
    t.integer  "active_checklist_id"
    t.text     "compliance_notification_message",            limit: 65535
    t.text     "compliance_notification_type",               limit: 65535
    t.string   "compliance_status",                          limit: 20
    t.string   "registration_steps"
    t.string   "insurance_doc_file_name"
    t.string   "insurance_doc_content_type"
    t.bigint   "insurance_doc_file_size"
    t.datetime "insurance_doc_updated_at"
    t.string   "rc_book_doc_file_name"
    t.string   "rc_book_doc_content_type"
    t.bigint   "rc_book_doc_file_size"
    t.datetime "rc_book_doc_updated_at"
    t.string   "puc_doc_file_name"
    t.string   "puc_doc_content_type"
    t.bigint   "puc_doc_file_size"
    t.datetime "puc_doc_updated_at"
    t.string   "commercial_permit_doc_file_name"
    t.string   "commercial_permit_doc_content_type"
    t.bigint   "commercial_permit_doc_file_size"
    t.datetime "commercial_permit_doc_updated_at"
    t.string   "road_tax_doc_file_name"
    t.string   "road_tax_doc_content_type"
    t.bigint   "road_tax_doc_file_size"
    t.datetime "road_tax_doc_updated_at"
    t.string   "vehicle_picture_doc_file_name"
    t.string   "vehicle_picture_doc_content_type"
    t.integer  "vehicle_picture_doc_file_size"
    t.datetime "vehicle_picture_doc_updated_at"
    t.string   "fitness_doc_file_name"
    t.string   "fitness_doc_content_type"
    t.integer  "fitness_doc_file_size"
    t.datetime "fitness_doc_updated_at"
    t.string   "authorization_certificate_doc_file_name"
    t.string   "authorization_certificate_doc_content_type"
    t.integer  "authorization_certificate_doc_file_size"
    t.datetime "authorization_certificate_doc_updated_at"
    t.boolean  "submitted_by_qc",                                          default: false
    t.string   "shift_start_time"
    t.string   "shift_end_time"
    t.string   "km_doc_upload_file_name"
    t.string   "km_doc_upload_content_type"
    t.integer  "km_doc_upload_file_size"
    t.datetime "km_doc_upload_updated_at"
    t.string   "km_doc_upload_url"
    t.index ["business_associate_id"], name: "index_vehicles_on_business_associate_id", using: :btree
    t.index ["driver_id"], name: "index_vehicles_on_driver_id", using: :btree
    t.index ["plate_number"], name: "index_vehicles_on_plate_number", using: :btree
  end

  create_table "web_api_tokens", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string "name",  null: false
    t.string "value", null: false
  end

  create_table "zone_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.decimal "rate",                          precision: 10, default: 0
    t.decimal "guard_rate",                    precision: 10, default: 0
    t.text    "name",            limit: 65535
    t.integer "vehicle_rate_id"
    t.index ["vehicle_rate_id"], name: "index_zone_rates_on_vehicle_rate_id", using: :btree
  end

  create_table "zones", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.decimal  "latitude",   precision: 10, scale: 6
    t.decimal  "longitude",  precision: 10, scale: 6
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "site_id"
    t.string   "zipcode"
    t.index ["site_id"], name: "index_zones_on_site_id", using: :btree
  end

  add_foreign_key "bus_trip_routes", "bus_trips"
  add_foreign_key "driver_requests", "drivers"
  add_foreign_key "employee_trips", "employee_clusters"
  add_foreign_key "trip_change_requests", "employees"
  add_foreign_key "trip_routes_clubbed", "employee_trips"
end
