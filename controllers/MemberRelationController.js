const respond = require('../utils/respond')
const MemberRelation = require('../models/MemberRelation')
const Member = require('../models/Member')

const MemberRelationController = {
    create: async function(level,agentId,memberId,t) {
    	var transactionO = {};
    	if (t) {
    		transactionO.transaction = t;
    	}
        try{
            return await MemberRelation.create({
                fxLevel: level,
                pid: agentId,
                cid: memberId,
            }, transactionO);
        }catch(e){
            throw new Error(e);
        }
    },

    getMemberLevelById: async function(memberId) {
    	try{
	    	var result = await MemberRelation.findOne({
                attributes: ['fxLevel'],
	    		where: {
	    			cid: memberId
	    		}
	    	});
            if (result) {
	    	    return result.fxLevel;
            }
            return null;
    	} catch(e) {
    		return null;
    	}
    },

    getCustomerByMemberId: async function(memberId) {
        try{
            var result = await MemberRelation.findAll({
                where: {
                    pid: memberId
                },
                include: [
                    {
                        model: Member,
                        as: 'member'
                    }
                ]
            });
            return result;
        } catch(e) {
            return e;
        }   
    }
}

module.exports = MemberRelationController