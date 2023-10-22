import { ChangeEvent, useState } from 'react';
import { css } from '@emotion/react';
import { useLazyQuery, useMutation } from '@apollo/client';

import addContact from '@/graphql/mutations/ADD_CONTACT_WITH_PHONES';
import useInput from '@/hooks/use-input';
import { useContact } from '@/store/context/contact-context';
import { Types } from '@/store/action/action';
import { useRouter } from 'next/router';
import GET_CONTACT_LIST from '@/graphql/queries/GET_CONTACTS';
import { theme } from '@theme';
import Header from '@/components/layout/Header';
import MainContainer from '@/components/layout/MainContainer';
import Head from 'next/head';
import SubmitButton from '@/components/shared/form/SubmitButton';

const mainContainerStyle = css({
  display: 'flex',
  justifyContent: 'center',

  '.contact-form': {
    width: '450px',
    maxWidth: '100%',
    marginTop: theme.spacing.lg,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.shape.rounded.xl,
    boxShadow: theme.shadow.normal,
  },

  '.form-title': {
    fontSize: theme.text.xl,
    fontWeight: 500,
    color: theme.palette.primary.main,
    textAlign: 'center',
  },

  '.form-input': {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    outline: 'none',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: theme.palette.grey[100],
    width: '100%',
    margin: '5px 0px',
    boxSizing: 'border-box',
    fontSize: theme.text.md,
  },

  '.input-error': {
    color: theme.palette.error.main,
    marginTop: theme.spacing.xs,
    fontSize: theme.text.sm,
  },

  [theme.breakpoints.sm]: {
    '.contact-form': {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    },
  },
});

/**
 * Regex to validate contact name: should not contains special Characters
 */
const nameValidation = /^[a-zA-Z0-9\s]*$/;

const AddContact = () => {
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value: string) => nameValidation.test(value) && value);

  const { state, dispatch } = useContact();
  const router = useRouter();
  const [phoneFields, setPhoneFields] = useState([{ number: '' }]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitContact] = useMutation(addContact, {
    onCompleted({ insert_contact }) {
      const addedContact = insert_contact?.returning?.[0];
      if (addedContact) {
        dispatch({
          type: Types.Add,
          payload: {
            contact: addedContact,
          },
        });
      }
      setIsSubmitting(false);

      router.push('/');
    },
    onError(error) {
      const errorMessage = error.message ?? '';
      if (errorMessage.includes('Uniqueness violation')) {
        setFormError(
          'Another contact with the same phone number already exists'
        );
      }
      setIsSubmitting(false);
    },
  });

  /**
   * This query used to check if contact with the same Name already exists
   */
  const [getContactList] = useLazyQuery(GET_CONTACT_LIST);

  const handlePhoneField = (e: ChangeEvent<HTMLInputElement>, ind: number) => {
    let newPhoneFields = [...phoneFields];
    newPhoneFields[ind].number = e.target.value;
    if (e.target.value.length > 0 && !phoneFields[ind + 1]) {
      newPhoneFields = [...newPhoneFields, { number: '' }];
    }
    setPhoneFields(newPhoneFields);
  };

  const formSubmissionHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!enteredNameIsValid) {
      setIsSubmitting(false);
      return;
    }

    /**
     * Split Name into first_name and last_name
     */
    const arrName = enteredName.split(' ');
    const firstName =
      arrName.length === 1
        ? arrName[0]
        : arrName.slice(0, arrName.length - 1).join(' ');
    const lastName = arrName.length === 1 ? '' : arrName[arrName.length - 1];

    /**
     * This section will check if contact already exists
     * If not, the update will be submitted
     */

    const existingContact = state.contactList.find(contact => {
      const name = `${contact.first_name} ${contact.last_name}`;
      const newContactName = `${firstName} ${lastName}`;
      if (name.toLowerCase().includes(newContactName.toLowerCase())) {
        setFormError('Another contact with the same name already exists');
        return true;
      }
    });

    if (existingContact) {
      setIsSubmitting(false);
      return;
    }

    const getExistingContact = getContactList({
      variables: {
        where: {
          first_name: { _ilike: firstName },
          last_name: { _ilike: lastName },
        },
      },
    });
    getExistingContact.then(result => {
      if (result?.data?.contact?.length > 0) {
        setFormError('Another contact with the same name already exists');
      } else {
        submitContact({
          variables: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phones: phoneFields.filter(phone => phone.number),
          },
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Add Contact - Effortlessly Expand Your Contact List</title>
        <meta
          name="description"
          content="Create new contacts and effortlessly organize your connections. Stay connected with ease."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kakaoico.ico" />
      </Head>
      <div>
        <Header />
        <MainContainer>
          <div css={mainContainerStyle}>
            <div className="contact-form">
              <h2 className="form-title">Create Contact</h2>
              <form onSubmit={formSubmissionHandler}>
                <div>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    onChange={nameChangedHandler}
                    onBlur={nameBlurHandler}
                    value={enteredName}
                    placeholder="Name"
                  />
                  {nameInputHasError && !enteredName && (
                    <p className="input-error">Name must not be empty</p>
                  )}
                  {nameInputHasError && enteredName && (
                    <p className="input-error">
                      Name should not contain any special characters.
                    </p>
                  )}
                  {phoneFields.map((field, ind) => {
                    return (
                      <input
                        key={`phoneInput-${ind}`}
                        id={`phoneInput-${ind}`}
                        className="form-input"
                        onChange={e => handlePhoneField(e, ind)}
                        placeholder={`Phone ${ind + 1}`}
                        value={field.number}
                      />
                    );
                  })}
                </div>
                {formError && <p className="input-error">{formError}</p>}
                <SubmitButton
                  text="Save Contact"
                  isDisabled={!enteredNameIsValid}
                  isSubmitting={isSubmitting}
                />
              </form>
            </div>
          </div>
        </MainContainer>
      </div>
    </>
  );
};

export default AddContact;
