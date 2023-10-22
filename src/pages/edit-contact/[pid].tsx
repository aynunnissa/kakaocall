import { ChangeEvent, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLazyQuery } from '@apollo/client';

import useInput from '@/hooks/use-input';
import { useContact } from '@/store/context/contact-context';
import { Types } from '@/store/action/action';
import { useRouter as useNav } from 'next/router';
import { useRouter } from 'next/router';
import GET_CONTACT_LIST from '@/graphql/queries/GET_CONTACTS';
import { theme } from '@theme';
import { IContact } from '@/store/types/contact';
import Header from '@/components/layout/Header';
import MainContainer from '@/components/layout/MainContainer';
import Head from 'next/head';
import SubmitButton from '@/components/shared/form/SubmitButton';
import Toast from '@/components/shared/Toast';

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

const EditContact = () => {
  const router = useRouter();
  const nav = useNav();
  const contactId = router.query.pid;

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    defaultValueHandler: setDefaultValue,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value: string) => nameValidation.test(value) && value);

  const { state, dispatch } = useContact();
  const [currentContact, setCurrentContact] = useState<IContact>();
  const [phoneFields, setPhoneFields] = useState([{ number: '' }]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opentoast, setOpenToast] = useState(false);

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
    setFormError('');
    setIsSubmitting(true);

    if (!enteredNameIsValid || !currentContact) {
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
      if (contact.id === currentContact.id) return false;

      const name = `${contact.first_name} ${contact.last_name}`;
      const updatedName = `${firstName} ${lastName}`;
      if (name.toLowerCase().includes(updatedName.toLowerCase())) {
        return true;
      }
    });

    if (existingContact) {
      setFormError('Another contact with the same name already exists');
      setIsSubmitting(false);
      setOpenToast(true);
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

    getExistingContact
      .then(result => {
        if (result?.data?.contact?.length > 0) {
          setFormError('Another contact with the same name already exists');
        } else {
          dispatch({
            type: Types.Edit,
            payload: {
              contact: {
                ...currentContact,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phones: phoneFields.filter(phone => phone.number),
              },
            },
          });
          nav.push('/');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setOpenToast(true);
      });
  };

  useEffect(() => {
    if (contactId) {
      const contact = state.contactList.find(
        contact => contact.id.toString() === contactId
      );

      if (!contact) {
        return;
      }

      setCurrentContact(contact);
      setDefaultValue(`${contact?.first_name} ${contact?.last_name}`);
      setPhoneFields([...contact.phones, { number: '' }]);
    }
  }, [contactId, state.contactList]);

  return (
    <>
      <Head>
        <title>Edit Contact - Update Contact Information</title>
        <meta
          name="description"
          content="Keep your contact list accurate and up-to-date with ease"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kakaoico.ico" />
      </Head>
      <div>
        <Header />
        <MainContainer>
          <div css={mainContainerStyle}>
            <div className="contact-form">
              <h2 className="form-title">Edit Contact</h2>
              <form onSubmit={formSubmissionHandler}>
                <div>
                  <input
                    type="text"
                    id="firstName"
                    className="form-input"
                    onChange={nameChangedHandler}
                    onBlur={nameBlurHandler}
                    value={enteredName}
                    placeholder="First name"
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
                  text="Submit Update"
                  isDisabled={!enteredName}
                  isSubmitting={isSubmitting}
                />
              </form>
            </div>
          </div>
        </MainContainer>
      </div>
      {opentoast && !formError && (
        <Toast
          text="Contact updated successfully!"
          variant="success"
          setOpenToast={setOpenToast}
        />
      )}
      {opentoast && formError && (
        <Toast
          text="Failed to update contact"
          variant="error"
          setOpenToast={setOpenToast}
        />
      )}
    </>
  );
};

export default EditContact;
