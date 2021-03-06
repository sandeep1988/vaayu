describe TransportDeskManager, type: :model do

  it { should have_one(:user).dependent(:destroy) }

  it { should belong_to(:employee_company) }
  it { should validate_presence_of(:employee_company) }

end