import { ObjectID } from 'bson'
import { STATUS } from '../../../utils/response_code'
import { SystemUserModel } from '../../../models/models/system_user'

export const getUserById = async (req, res, next) => {
  const {userId} = req.params

  if (!ObjectID.isValid(userId)) {
    return void res.status(STATUS.BAD_REQUEST).send('invalid user id')
  }

  try {
    const user = await SystemUserModel.findById(userId)

    res.send(user)
  } catch (err) {
    next(err)
  }
}
