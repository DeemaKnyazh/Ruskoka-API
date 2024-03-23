class Camper{
    constructor(id,timestamp,email,camper,birthday,gender,mainContact,mainPhone,mainRelation,alternateContact,alternateEmail,alternatePhone,alternateRelation,session,sessions,preferred,ruskokaEx,campEx,faith,swimming,russian,english,medical,financial,volunteering){
        this.id = id;
        this.timestamp = timestamp;
        this.email = email;
        this.camper = camper;
        this.birthday = birthday;
        this.gender = gender;
        this.mainContact = mainContact;
        this.mainPhone = mainPhone;
        this.mainRelation = mainRelation;
        this.alternateContact = alternateContact;
        this.alternateEmail = alternateEmail;
        this.alternatePhone = alternatePhone;
        this.alternateRelation = alternateRelation;
        this.session = session;
        this.sessions = sessions;
        this.preferred = preferred;
        this.ruskokaEx = ruskokaEx;
        this.campEx = campEx;
        this.faith = faith;
        this.swimming = swimming;
        this.russian = russian;
        this.english = english;
        this.medical = medical;
        this.financial = financial;
        this.volunteering = volunteering;
    }
}

module.exports = Camper;