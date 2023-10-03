'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');
const bcrypt = require('bcrypt');


const getEndUsers = async () => {

    try {
        let pool = await sql.connect(config.sql);
        const getAllQuery = "SELECT [END_USER_ID] ,[END_USER_FIRST_NAME],[END_USER_LAST_NAME] "+
        " ,[END_USER_EMAIL], [USER_ROLE_NAME], [ACTIVE_STATUS_DESC], eu.[ACTIVE_STATUS_ID] FROM [dbo].[END_USER] AS eu" +
        " JOIN [dbo].[USER_ROLE] AS ur ON eu.[USER_ROLE_ID] = ur.[USER_ROLE_ID] " +
        " JOIN [dbo].[ACTIVE_STATUS] AS acs ON eu.[ACTIVE_STATUS_ID] = acs.[ACTIVE_STATUS_ID]" ;
        const endUsersList = await pool.request().query(getAllQuery);
        return endUsersList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async (END_USER_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const byIdQuery = "SELECT [END_USER_ID] ,[END_USER_FIRST_NAME],[END_USER_LAST_NAME] "+
        " ,[END_USER_EMAIL] ,[END_USER_PRIMARY_PHONE]  ,[END_USER_CLASS]  FROM [dbo].[END_USER] WHERE END_USER_ID=@END_USER_ID";
        const enduser = await pool.request()
            .input('END_USER_ID', sql.Int, END_USER_ID)
            .query(byIdQuery);
        return enduser.recordset;
    } catch (error) {
        return error.message;
    }
}

const createEndUser = async (endUserData) => {
    try {
        let pool = await sql.connect(config.sql);
        const createQuery = "INSERT INTO [dbo].[END_USER] ([END_USER_FIRST_NAME] "+
        " ,[END_USER_LAST_NAME]  ,[END_USER_EMAIL] ,[END_USER_PASSWORD] "+
        ",[END_USER_PERIOD], [USER_ROLE_ID], [ACTIVE_STATUS_ID]) VALUES"+ 
        "(@END_USER_FIRST_NAME, @END_USER_LAST_NAME "+
        ",@END_USER_EMAIL, @END_USER_PASSWORD, @END_USER_PERIOD, @USER_ROLE_ID, @ACTIVE_STATUS_ID)"

        const insertEndUser = await pool.request()
            .input('END_USER_FIRST_NAME', sql.NVarChar(40), endUserData.END_USER_FIRST_NAME)
            .input('END_USER_LAST_NAME', sql.NVarChar(40), endUserData.END_USER_LAST_NAME)
            .input('END_USER_EMAIL', sql.NVarChar(255), endUserData.END_USER_EMAIL)
            .input('END_USER_PASSWORD', sql.NVarChar(255), endUserData.END_USER_PASSWORD)
            .input('END_USER_PERIOD', sql.Int, endUserData.END_USER_PERIOD)
            .input('USER_ROLE_ID', sql.Int, endUserData.USER_ROLE_ID)
            .input('ACTIVE_STATUS_ID', sql.Int, endUserData.ACTIVE_STATUS_ID)
            .query(createQuery);
        return insertEndUser.recordset;
    } catch (error) {
        return error.message;
    }
}

const endUserLogin = async (END_USER_EMAIL, END_USER_PASSWORD) => {
    try {
        let pool = await sql.connect(config.sql);
        const loginQuery = "SELECT END_USER_ID, END_USER_FIRST_NAME, END_USER_EMAIL, USER_ROLE_ID " +
        "FROM [dbo].[END_USER] " +
        "WHERE END_USER_EMAIL=@END_USER_EMAIL";

        const loginUser = await pool.request()
            .input('END_USER_EMAIL', sql.NVarChar(255), END_USER_EMAIL)
            .query(loginQuery)
        if (loginUser.recordset.length > 1) {
            const userData = loginUser.recordset[0]
            const storedHashedPassword = userData.END_USER_PASSWORD

            const passwordMatch = await bcrypt.compare(END_USER_PASSWORD, storedHashedPassword)

            if (passwordMatch) {
                return userData
            }
        }

        return null
    } catch (error) {
        return error.message
    }
}

const getHashedPassword = async (END_USER_EMAIL) => {
    try {
        let pool = await sql.connect(config.sql);
        const query = "SELECT END_USER_PASSWORD FROM [dbo].[END_USER] WHERE END_USER_EMAIL=@END_USER_EMAIL"
        const passwordRetrieved = await pool.request()
            .input('END_USER_EMAIL', sql.NVarChar(255), END_USER_EMAIL)
            .query(query);

        if (passwordRetrieved.recordset.length > 0) {
            return passwordRetrieved.recordset[0].END_USER_PASSWORD
        } else {
            return null
        }
    } catch (error) {
        return error.message
    }
}

const updateEndUser = async (END_USER_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateQuery = "UPDATE [dbo].[END_USER] SET [END_USER_FIRST_NAME] = @END_USER_FIRST_NAME, "+
        " [END_USER_LAST_NAME] = @END_USER_LAST_NAME, "+
        " [END_USER_EMAIL] = @END_USER_EMAIL, "+
        " [END_USER_PRIMARY_PHONE] = @END_USER_PRIMARY_PHONE, "+
        " [END_USER_CLASS] = @END_USER_CLASS  WHERE END_USER_ID = @END_USER_ID"
        const update = await pool.request()
            .input('END_USER_ID', sql.Int, END_USER_ID)
            .input('END_USER_FIRST_NAME', sql.NVarChar(40), data.END_USER_FIRST_NAME)
            .input('END_USER_LAST_NAME', sql.NVarChar(40), data.END_USER_LAST_NAME)
            .input('END_USER_EMAIL', sql.NVarChar(40), data.END_USER_EMAIL)
            .input('END_USER_PRIMARY_PHONE', sql.NVarChar(40), data.END_USER_PRIMARY_PHONE)
            .input('END_USER_CLASS', sql.NVarChar(40), data.END_USER_CLASS)
            .query(updateQuery);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteEndUser = async (END_USER_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteQuery = "DELETE FROM [END_USER] WHERE [END_USER_ID]=@END_USER_ID"
        const deleteEndUser = await pool.request()
            .input('END_USER_ID', sql.Int, END_USER_ID)
            .query(deleteQuery);
        return deleteEndUser.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getEndUsers,
    getById,
    createEndUser,
    endUserLogin,
    getHashedPassword,
    updateEndUser,
   
    deleteEndUser
}