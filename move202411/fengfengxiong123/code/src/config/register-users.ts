interface RegisterUsersProps {
  name: {
    type: string;
    value: string;
  };
  bcsName: string;
  type: string;
  objectType: string;
  objectId: string;
  version: number;
  digest: string;
}

const registerUsers: RegisterUsersProps[] = [
  {
    name: {
      type: "0x1::string::String",
      value: "2af6c1938280cf418ce388f62deffe9a56746d0887c9e6c031a4127016987e35",
    },
    bcsName:
      "6faQLoojbURBsLiKrLiNr7vrsLRF7KQ2sNEVBaM3wjcYt5YPeMvCgwPrJaYKFNtnPJG1MJGzuovHJ9WQZWCT7PLn8",
    type: "DynamicField",
    objectType:
      "0xc0dc1d96f4e76ffb9229af266b6078bf95223c70eeac32ce10289e3830572583::hcsc_v3::User<0xc0dc1d96f4e76ffb9229af266b6078bf95223c70eeac32ce10289e3830572583::hcsc_v3::LabReport>",
    objectId:
      "0xb14679aa0fc332ae0489d4f1127c1eb1f0496c21d434fb53f224c6c9d75389b6",
    version: 239672375,
    digest: "FDmhP3EeNNpBinKsbmpy544wp4c5WSgLVABNsj5Ea8ez",
  },
  {
    name: {
      type: "0x1::string::String",
      value: "d790d41adfffd48df8e38607991a297970743decff87517e647008a652587d4c",
    },
    bcsName:
      "6gaC7poTP3aEi2RfkckNc2cp6gsGASWbWMv954FZPc59RkS8aMfF8Ht9dNSKKsQjY3jiVGGx4M5wCVTWkxaHxU8gi",
    type: "DynamicField",
    objectType:
      "0xc0dc1d96f4e76ffb9229af266b6078bf95223c70eeac32ce10289e3830572583::hcsc_v3::User<0xc0dc1d96f4e76ffb9229af266b6078bf95223c70eeac32ce10289e3830572583::hcsc_v3::LabReport>",
    objectId:
      "0xd9fed58945c778ee4261a5969ed68a3a283a0ae6ffa1bce76e5f71e6d67ece5e",
    version: 240761213,
    digest: "CGrkQK37jGqXdSyojATmxrS6wS2q6p8841ChNnsrvbdu",
  },
];
